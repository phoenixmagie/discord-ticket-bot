import { 
    ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, 
    ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle 
} from 'discord.js';
import { readFile, writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Pfad zur zentralen Config im Root auflösen / Resolve path to central root config
const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config.json');

// Config sicher lesen / Helper to safely read config
async function loadConfig() {
    const fileContent = await readFile(configPath, 'utf-8');
    return JSON.parse(fileContent);
}

// Config-Änderung speichern / Save updated config state
async function saveConfig(configData) {
    await writeFile(configPath, JSON.stringify(configData, null, 2), 'utf-8');
}

// --- HELPER FUNCTION FOR TICKET CLOSING & GITHUB UPLOAD ---
async function closeTicket(channel, closedByUserId, reason, config) {
    try {
        let ticketId = '0';
        let openerName = 'user';

        if (channel.topic && channel.topic.includes('|')) {
            const parts = channel.topic.split('|');
            ticketId = parts[0]?.split(':')[1] || '0';
            openerName = parts[1]?.split(':')[1] || 'user';
        }

        const messagesRaw = await channel.messages.fetch({ limit: 100 });
        const messages = Array.from(messagesRaw.values()).reverse();

        // Transcript-Template laden / Load transcript template
        const templatePath = join(process.cwd(), 'assets', 'transcript-template.html');
        let template = readFileSync(templatePath, 'utf8');
        let messagesHtml = '';

        for (const msg of messages) {
            const avatar = msg.author.displayAvatarURL({ extension: 'png' });

            let content = '';
            if (msg.content) {
                content = msg.content
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/__(.*?)__/g, '<u>$1</u>')
                    .replace(/~~(.*?)~~/g, '<del>$1</del>')
                    .replace(/&lt;@!?(\d+)&gt;/g, '<span class="mention">@User</span>')
                    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            }

            let embedsHtml = '';
            if (msg.embeds && msg.embeds.length > 0) {
                msg.embeds.forEach(embed => {
                    const color = embed.hexColor || '#2b2d31';
                    embedsHtml += `<div class="discord-embed" style="border-left-color: ${color};">`;

                    if (embed.author) embedsHtml += `<div class="embed-author">${embed.author.name}</div>`;
                    if (embed.title) embedsHtml += `<div class="embed-title">${embed.title}</div>`;
                    if (embed.description) embedsHtml += `<div class="embed-desc">${embed.description}</div>`;

                    if (embed.fields && embed.fields.length > 0) {
                        embed.fields.forEach(field => {
                            embedsHtml += `<div class="embed-field"><div class="embed-field-name">${field.name}</div><div class="embed-field-value">${field.value}</div></div>`;
                        });
                    }

                    if (embed.footer) embedsHtml += `<div class="embed-footer">${embed.footer.text}</div>`;
                    embedsHtml += `</div>`;
                });
            }

            let attachmentsHtml = '';
            msg.attachments.forEach(att => {
                if (att.contentType && att.contentType.startsWith('image/')) {
                    attachmentsHtml += `<img src="${att.url}" class="attachment">`;
                } else {
                    attachmentsHtml += `<br><a href="${att.url}" target="_blank">📄 ${att.name}</a>`;
                }
            });

            messagesHtml += `
            <div class="message">
                <img src="${avatar}" class="avatar">
                <div class="content">
                    <div class="meta">
                        <span class="username">${msg.author.username}</span>
                        <span class="timestamp">${new Date(msg.createdTimestamp).toLocaleString('en-US')}</span>
                    </div>
                    <div class="text">${content}</div>
                    ${embedsHtml}
                    ${attachmentsHtml}
                </div>
            </div>`;
        }

        template = template.replace(/{{SERVER_NAME}}/g, channel.guild.name)
                           .replace(/{{TICKET_NAME}}/g, channel.name)
                           .replace('{{MESSAGES}}', messagesHtml);

        const filename = `${ticketId}-${openerName}.html`.replace(/[^a-zA-Z0-9-.]/g, '');
        const encodedContent = Buffer.from(template, 'utf-8').toString('base64');

        // Dynamische GitHub Settings / Dynamic GitHub Settings
        const ghSettings = config.github_settings || {};
        if (process.env.GITHUB_TOKEN && ghSettings.repository_owner && ghSettings.repository_name) {
            const githubEndpoint = `https://api.github.com/repos/${ghSettings.repository_owner}/${ghSettings.repository_name}/contents/${ghSettings.tickets_path || 'tickets'}/${filename}`;
            
            await fetch(githubEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Upload Transcript: ${filename}`,
                    content: encodedContent
                })
            }).catch(e => console.error('GitHub API error during transcript upload:', e));
        }

        const transcriptUrl = `${ghSettings.base_transcript_url || ''}${filename}`;
        const logChannelId = config.transcript_settings?.log_channel_id;
        const logChannel = channel.guild.channels.cache.get(logChannelId);

        if (logChannel) {
            const logText = config.texts.log_desc
                .replace('{ticket_name}', channel.name)
                .replace('{user_id}', closedByUserId)
                .replace('{reason}', reason || config.texts.txt_no_reason)
                .replace('{url}', transcriptUrl);

            const logEmbed = new EmbedBuilder()
                .setTitle(config.texts.log_title)
                .setDescription(logText)
                .setColor('#ff0000')
                .setTimestamp();
            await logChannel.send({ embeds: [logEmbed] });
        }

        setTimeout(async () => await channel.delete().catch(() => null), 4000);
    } catch (err) {
        console.error('Error closing ticket:', err);
    }
}

export const name = 'interactionCreate';

export async function execute(interaction) {
    if (interaction.isChatInputCommand()) return;

    try {
        const config = await loadConfig();
        const texts = config.texts;

        const sendError = (msg) => interaction.reply({ 
            embeds: [new EmbedBuilder().setDescription(msg).setColor('#ff0000')], 
            ephemeral: true 
        });

        // === 1. CREATE TICKET ===
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_create_menu') {
            await interaction.deferReply({ ephemeral: true });

            const newId = (config.ticket_counter || 0) + 1;
            config.ticket_counter = newId;
            
            // Ticket-Zähler persistent speichern / Persist ticket counter
            await saveConfig(config);

            const selectedValue = interaction.values[0];
            const categoryObj = config.categories.find(c => c.value === selectedValue);
            const categoryName = categoryObj ? categoryObj.label : selectedValue;

            const supportRoleId = categoryObj?.role_id || config.ticket_settings.support_role_id;

            let channelName = config.ticket_settings.name_format
                .replace('{id}', newId)
                .replace('{categorie}', categoryName.toLowerCase().replace(/\s+/g, '-'))
                .replace('{user}', interaction.user.username.toLowerCase());

            const ticketChannel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: config.ticket_settings.category_id,
                topic: `ID:${newId}|User:${interaction.user.username}|UserID:${interaction.user.id}|RoleID:${supportRoleId}`, 
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    { id: supportRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });

            const embedTitle = config.ticket_settings.inside_embed.title.replace('{categorie}', categoryName);
            const embedDesc = config.ticket_settings.inside_embed.description
                .replace('{user}', interaction.user.username).replace('{user_id}', interaction.user.id);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(embedDesc)
                .setColor(config.ticket_settings.inside_embed.color || '#00ff00');

            const btnClaim = new ButtonBuilder().setCustomId('ticket_claim').setLabel(texts.btn_claim).setStyle(ButtonStyle.Success);
            const btnCloseReason = new ButtonBuilder().setCustomId('ticket_close_reason_direct').setLabel(texts.btn_close_reason).setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(btnClaim, btnCloseReason);

            await ticketChannel.send({
                content: `<@${interaction.user.id}> | <@&${supportRoleId}>`,
                embeds: [ticketEmbed],
                components: [row]
            });

            const successEmbed = new EmbedBuilder().setDescription(texts.msg_ticket_created.replace('{channel}', ticketChannel.id)).setColor('#00ff00');
            return interaction.editReply({ embeds: [successEmbed] });
        }

        const getRoleIdFromTopic = (channel) => {
            if (channel.topic && channel.topic.includes('RoleID:')) {
                const parts = channel.topic.split('|');
                const rolePart = parts.find(p => p.startsWith('RoleID:'));
                if (rolePart) return rolePart.split(':')[1];
            }
            return config.ticket_settings.support_role_id;
        };

        // === BUTTON: CLAIM ===
        if (interaction.isButton() && interaction.customId === 'ticket_claim') {
            const supportRoleId = getRoleIdFromTopic(interaction.channel);

            if (!interaction.member.roles.cache.has(supportRoleId)) return sendError(texts.err_no_perms);

            await interaction.channel.permissionOverwrites.edit(supportRoleId, { SendMessages: false });
            await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: true });

            const btnDash = new ButtonBuilder().setCustomId('ticket_dashboard').setLabel(texts.btn_dashboard).setStyle(ButtonStyle.Primary);
            const btnCloseReason = new ButtonBuilder().setCustomId('ticket_close_reason_direct').setLabel(texts.btn_close_reason).setStyle(ButtonStyle.Danger);

            await interaction.message.edit({ components: [new ActionRowBuilder().addComponents(btnDash, btnCloseReason)] });

            const claimEmbed = new EmbedBuilder().setDescription(texts.msg_claimed.replace('{user}', interaction.user.id)).setColor('#0099ff');
            return interaction.reply({ embeds: [claimEmbed] });
        }

        // === BUTTON: TEAM DASHBOARD ===
        if (interaction.isButton() && interaction.customId === 'ticket_dashboard') {
            const supportRoleId = getRoleIdFromTopic(interaction.channel);
            if (!interaction.member.roles.cache.has(supportRoleId)) return sendError(texts.err_no_perms);

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('dashboard_select')
                .setPlaceholder(texts.dash_placeholder)
                .addOptions([
                    { label: texts.dash_unclaim, value: 'unclaim' },
                    { label: texts.dash_close, value: 'close' },
                    { label: texts.dash_close_reason, value: 'close_reason' },
                    { label: texts.dash_closereq, value: 'closereq' },
                    { label: texts.dash_closereq_reason, value: 'closereq_reason' }
                ]);

            const dashEmbed = new EmbedBuilder().setDescription("🛠️ **Staff Dashboard**\nSelect an action below.").setColor('#2b2d31');
            return interaction.reply({ embeds: [dashEmbed], components: [new ActionRowBuilder().addComponents(selectMenu)], ephemeral: true });
        }

        // === DASHBOARD: SELECT MENU ===
        if (interaction.isStringSelectMenu() && interaction.customId === 'dashboard_select') {
            const action = interaction.values[0];
            const supportRoleId = getRoleIdFromTopic(interaction.channel);

            if (action === 'unclaim') {
                await interaction.channel.permissionOverwrites.edit(supportRoleId, { SendMessages: true });
                const mainMsg = await interaction.channel.messages.fetch({ limit: 50 }).then(msgs => msgs.find(m => m.components.length > 0 && m.author.id === interaction.client.user.id));

                if (mainMsg) {
                    const btnClaim = new ButtonBuilder().setCustomId('ticket_claim').setLabel(texts.btn_claim).setStyle(ButtonStyle.Success);
                    const btnCloseReason = new ButtonBuilder().setCustomId('ticket_close_reason_direct').setLabel(texts.btn_close_reason).setStyle(ButtonStyle.Danger);
                    await mainMsg.edit({ components: [new ActionRowBuilder().addComponents(btnClaim, btnCloseReason)] });
                }

                await interaction.update({ embeds: [new EmbedBuilder().setDescription(texts.msg_action_done).setColor('#00ff00')], components: [] });
                const unclaimEmbed = new EmbedBuilder().setDescription(texts.msg_unclaimed).setColor('#ffaa00');
                return interaction.channel.send({ embeds: [unclaimEmbed] });
            }

            if (action === 'close') {
                const btnYes = new ButtonBuilder().setCustomId('btn_close_yes').setLabel(texts.btn_yes).setStyle(ButtonStyle.Danger);
                const btnNo = new ButtonBuilder().setCustomId('btn_close_no').setLabel(texts.btn_no).setStyle(ButtonStyle.Secondary);
                const confirmEmbed = new EmbedBuilder().setDescription(texts.confirm_close).setColor('#ff0000');
                return interaction.update({ embeds: [confirmEmbed], components: [new ActionRowBuilder().addComponents(btnYes, btnNo)] });
            }

            if (action === 'close_reason' || action === 'closereq_reason') {
                const modalId = action === 'close_reason' ? 'modal_close_reason' : 'modal_closereq_reason';
                const modal = new ModalBuilder().setCustomId(modalId).setTitle(texts.modal_reason_title);
                const input = new TextInputBuilder().setCustomId('reason_input').setLabel(texts.modal_reason_input).setStyle(TextInputStyle.Paragraph).setRequired(true);
                modal.addComponents(new ActionRowBuilder().addComponents(input));
                return interaction.showModal(modal);
            }

            if (action === 'closereq') {
                const btnAccept = new ButtonBuilder().setCustomId('btn_accept_close').setLabel(texts.btn_accept_close).setStyle(ButtonStyle.Success);
                const reqEmbed = new EmbedBuilder().setDescription(texts.closereq_msg).setColor('#0099ff');
                await interaction.channel.send({ embeds: [reqEmbed], components: [new ActionRowBuilder().addComponents(btnAccept)] });
                return interaction.update({ embeds: [new EmbedBuilder().setDescription(texts.msg_request_sent).setColor('#00ff00')], components: [] });
            }
        }

        // === BUTTON: DIRECT CLOSE WITH REASON ===
        if (interaction.isButton() && interaction.customId === 'ticket_close_reason_direct') {
            const modal = new ModalBuilder().setCustomId('modal_close_reason').setTitle(texts.modal_reason_title);
            const input = new TextInputBuilder().setCustomId('reason_input').setLabel(texts.modal_reason_input).setStyle(TextInputStyle.Paragraph).setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(input));
            return interaction.showModal(modal);
        }

        // === BUTTONS: CLOSE CONFIRMATION ===
        if (interaction.isButton() && interaction.customId === 'btn_close_yes') {
            await interaction.update({ embeds: [new EmbedBuilder().setDescription(texts.msg_closing).setColor('#ff0000')], components: [] });
            return closeTicket(interaction.channel, interaction.user.id, null, config);
        }

        if (interaction.isButton() && interaction.customId === 'btn_close_no') {
            return interaction.message.delete().catch(() => null);
        }

        if (interaction.isButton() && interaction.customId === 'btn_accept_close') {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(texts.msg_close_accepted).setColor('#ff0000')] });
            return closeTicket(interaction.channel, interaction.user.id, texts.txt_reason_accepted, config);
        }

        // === MODALS ===
        if (interaction.isModalSubmit()) {
            const reason = interaction.fields.getTextInputValue('reason_input');

            if (interaction.customId === 'modal_close_reason') {
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(texts.msg_closing_reason).setColor('#ff0000')] });
                return closeTicket(interaction.channel, interaction.user.id, reason, config);
            }

            if (interaction.customId === 'modal_closereq_reason') {
                const btnAccept = new ButtonBuilder().setCustomId('btn_accept_close').setLabel(texts.btn_accept_close).setStyle(ButtonStyle.Success);
                const reqEmbed = new EmbedBuilder().setDescription(texts.closereq_msg_reason.replace('{reason}', reason)).setColor('#0099ff');
                await interaction.channel.send({ embeds: [reqEmbed], components: [new ActionRowBuilder().addComponents(btnAccept)] });
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(texts.msg_request_sent).setColor('#00ff00')], ephemeral: true });
            }
        }

    } catch (err) {
        // Logging mit Kontext / Contextual error log
        console.error('Critical error in ticket interaction handler:', err);
    }
}
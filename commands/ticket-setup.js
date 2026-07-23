import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Root-Pfad der Config auflösen / Resolve config root path
const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config.json');

export const data = new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Create a Ticket Panel');

export async function execute(interaction) {
    try {
        // Lokale Config laden / Load local config
        const fileContent = await readFile(configPath, 'utf-8');
        const config = JSON.parse(fileContent);

        const setupEmbed = new EmbedBuilder()
            .setTitle(config.setup_embed?.title || 'Support Tickets')
            .setDescription(config.setup_embed?.description || 'Select a category.')
            .setColor(config.setup_embed?.color || '#0099ff');

        // Max 25 Optionen für SelectMenu / Max 25 options for SelectMenu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_create_menu')
            .setPlaceholder(config.menu_placeholder || 'Select...')
            .addOptions(
                (config.categories || []).slice(0, 25).map(cat => ({
                    label: cat.label,
                    description: cat.description || '',
                    value: cat.value,
                    emoji: cat.emoji || '🎫'
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.channel.send({
            embeds: [setupEmbed],
            components: [row]
        });

        await interaction.reply({
            content: 'Ticket Panel successfully created',
            ephemeral: true
        });

    } catch (err) {
        // Fehler-Logging & Fallback / Error logging & fallback
        console.error('Fehler bei /ticket-setup:', err);
        
        const errorMessage = '❌ Config-File not found or loaded';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}
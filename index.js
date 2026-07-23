import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import 'dotenv/config';

// ES-Module Unterstützung für __dirname / ES module support for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Erforderlich für Gildenmitglieder-Events / Required for guild member events
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();

console.clear();

const commandsArray = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(chalk.blue('ℹ  Lade Commands... / Loading commands...'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`./commands/${file}`);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        console.log(chalk.gray(`  └─ Command geladen / Command loaded: `) + chalk.cyan(`/${command.data.name}`));
    } else {
        console.log(chalk.yellow(`⚠️  [WARNUNG / WARNING] Command @ ${filePath} missing "data" or "execute".`));
    }
}

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    console.log(chalk.blue('\nℹ  Lade Events... / Loading events...'));

    for (const file of eventFiles) {
        const event = await import(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(chalk.gray(`  └─ Event geladen / Event loaded: `) + chalk.cyan(event.file || file) + chalk.gray(` (${event.name})`));
    }
}

client.once('ready', async () => {
    console.log(chalk.green(`\n✅ Eingeloggt als / Logged in as ${chalk.bold(client.user.tag)}`));

    client.user.setPresence({
        activities: [{ 
            name: 'Community', 
            type: 5                
        }],
        status: 'dnd',             
    });
    console.log(chalk.magenta('📌 Präsenz gesetzt / Presence set!'));

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(chalk.blue('🔄 Aktualisiere Commands auf Discord... / Syncing commands to Discord...'));

        // Registriert Befehle direkt in der Test-Gilde / Registers commands directly to the dev guild
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsArray },
        );

        console.log(chalk.green('🚀 Commands erfolgreich registriert! / Commands registered successfully!'));
    } catch (error) {
        console.error(chalk.red('❌ Fehler beim Registrieren / Registration error:'), error);
    }
});

client.login(process.env.DISCORD_TOKEN);
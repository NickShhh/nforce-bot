require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Channel]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name && command.execute) {
        client.commands.set(command.name, command);
    } else {
        console.warn(`[WARN] El comando en ${file} está mal estructurado o incompleto.`);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
    }
});

// Manejando el botón de ban
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('banUser_')) {
            const userId = interaction.customId.split('_')[1];
            const isAdmin = adminIds.includes(interaction.user.id);

            if (!isAdmin) {
                return interaction.reply({ content: "❌ You don't have permission to use this button.", ephemeral: true });
            }

            // Aquí se hace el ban al usuario y se edita el mensaje anterior
            // Ya tienes esta lógica implementada en el handler del botón
        }
    }
});

client.once('ready', () => {
    console.log(`✅ N-FORCE bot connected as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.get("/", (_, res) => res.send("N-FORCE bot is running."));
app.listen(10000, () => console.log("🌐 Express server running on port 10000"));

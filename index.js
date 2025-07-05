const { Client, GatewayIntentBits, Collection, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command && command.name && command.execute) {
    client.commands.set(command.name, command);
  } else {
    console.warn(`[WARN] El comando en ${file} está mal estructurado o incompleto.`);
  }
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      await command.execute(interaction);
    }
  } else if (interaction.isButton()) {
    const [action, userId] = interaction.customId.split('_');
    if (action === 'ban') {
      const isAdmin = config.adminIds.includes(interaction.user.id);
      if (!isAdmin) return interaction.reply({ content: '⛔ No tienes permiso para usar este botón.', ephemeral: true });

      // Actualiza mensaje original
      await interaction.update({ components: [] });

      await interaction.followUp({
        content: `✅ El usuario \`${userId}\` ha sido baneado por ${interaction.user.tag}.`,
      });

      // Aquí puedes también hacer el fetch al backend para aplicar el ban
    }
  }
});

client.login(config.token);

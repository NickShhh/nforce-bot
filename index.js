require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Partials, Events } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

// Cargar comandos desde ./commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command && command.name && typeof command.execute === 'function') {
    client.commands.set(command.name, command);
  } else {
    console.warn(`[WARN] El comando en ${file} está mal estructurado o incompleto.`);
  }
}

const adminIds = process.env.ADMIN_IDS?.split(',') || [];

client.on('ready', () => {
  console.log(`✅ Bot N-FORCE iniciado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ An unexpected error occurred.', ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    const [action, userId] = interaction.customId.split(':');

    if (action === 'banUser') {
      if (!adminIds.includes(interaction.user.id)) {
        return await interaction.reply({ content: '❌ You do not have permission to perform this action.', ephemeral: true });
      }

      const reason = 'Manual ban from Discord'; // Puedes mejorar esto luego con modal o inputs
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/bans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, reason })
        });

        if (res.ok) {
          await interaction.reply({ content: `✅ User \`${userId}\` has been banned by <@${interaction.user.id}>.`, ephemeral: false });
        } else {
          const error = await res.json();
          await interaction.reply({ content: `❌ Failed to ban user: ${error.message || 'Unknown error'}`, ephemeral: true });
        }
      } catch (err) {
        console.error('Error banning user:', err);
        await interaction.reply({ content: '❌ Internal server error during ban.', ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

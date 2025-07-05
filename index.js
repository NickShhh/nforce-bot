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
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/exploit-reports', async (req, res) => {
  const report = req.body;
  try {
    const channel = await client.channels.fetch('ID_DEL_CANAL_DISCORD');

    const embed = {
      color: 0xff0000,
      title: '🚨 Possible Exploiter Detected',
      fields: [
        { name: 'User', value: `\`${report.username} (${report.userId})\`` },
        { name: 'Reason', value: report.reason || 'Unspecified exploit' },
        { name: 'Device', value: report.deviceType || 'Unknown', inline: true },
        { name: 'Location', value: report.location || 'Unavailable', inline: true },
        { name: 'FPS / Ping', value: `FPS: ${report.fps || 'N/A'} / Ping: ${report.ping || 'N/A'}`, inline: true },
        { name: 'Team', value: report.team || 'None', inline: true },
        { name: 'Humanoid Stats', value: `WalkSpeed: ${report.walkSpeed}\nJumpPower: ${report.jumpPower}\nGravity: ${report.gravity}`, inline: true },
      ],
      timestamp: new Date(),
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ban_${report.userId}`)
        .setLabel('Ban User')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });

    res.status(200).json({ message: 'Reporte enviado correctamente al canal de Discord.' });
  } catch (error) {
    console.error('Error al enviar el reporte:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`);
});

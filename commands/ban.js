const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const allowedMods = process.env.MODERATOR_IDS.split(',');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear a un jugador manualmente')
    .addStringOption(opt => opt.setName('userid').setDescription('UserId del jugador').setRequired(true))
    .addStringOption(opt => opt.setName('username').setDescription('Nombre de usuario').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Razón del baneo').setRequired(true)),
  async execute(interaction) {
    if (!allowedMods.includes(interaction.user.id)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const userId = interaction.options.getString('userid');
    const username = interaction.options.getString('username');
    const reason = interaction.options.getString('reason');

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, reason, moderator: interaction.user.tag })
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      await interaction.reply(`🚫 **${username}** ha sido baneado por: *${reason}* (${data.country})`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Error al enviar el baneo.');
    }
  }
};
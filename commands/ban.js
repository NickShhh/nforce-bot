const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear a un usuario')
    .addStringOption(opt => opt.setName('userid').setDescription('UserId del jugador').setRequired(true))
    .addStringOption(opt => opt.setName('username').setDescription('Nombre de usuario').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setDescription('Razón del baneo').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const username = interaction.options.getString('username');
    const reason = interaction.options.getString('razon');
    const moderator = interaction.user.tag;

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, reason, moderator })
      });
      const data = await res.json();
      await interaction.reply(`✅ Usuario \`${username}\` baneado. País: \`${data.country}\``);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Error al contactar con el backend.');
    }
  }
};
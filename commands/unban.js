const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanear a un usuario')
    .addStringOption(opt => opt.setName('userid').setDescription('UserId del jugador').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/unban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error();
      await interaction.reply(`✅ Usuario desbaneado correctamente.`);
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ No se pudo desbanear al usuario.');
    }
  }
};
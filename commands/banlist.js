const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Mostrar lista de usuarios baneados'),
  async execute(interaction) {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/banlist`);
      const data = await res.json();
      if (!data || data.length === 0) {
        return await interaction.reply('✅ No hay usuarios baneados.');
      }

      const text = data.map((ban, i) => 
        `\`${i + 1}.\` **${ban.username}** (ID: \`${ban.userId}\`) — ${ban.reason} *(por ${ban.moderator})*`
      ).join('\n');

      await interaction.reply({ content: `📄 Lista de baneados:\n${text}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Error al obtener la lista de baneados.');
    }
  }
};
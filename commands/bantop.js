const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const allowedMods = process.env.MODERATOR_IDS.split(',');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bantop')
    .setDescription('Mostrar el top de moderadores que más han baneado'),
  async execute(interaction) {
    if (!allowedMods.includes(interaction.user.id)) {
      return interaction.reply({ content: '❌ No tienes permiso para ver el ranking.', ephemeral: true });
    }

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/bantop`);
      const top = await res.json();

      if (!top || top.length === 0) {
        return await interaction.reply('Ningún moderador ha realizado baneos todavía.');
      }

      const text = top.map((mod, i) =>
        `\`${i + 1}.\` **${mod.moderator}** — \`${mod.count}\` baneos`
      ).join('\n');

      await interaction.reply({ content: `🏆 Top Moderadores:\n${text}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Error al obtener el ranking.');
    }
  }
};
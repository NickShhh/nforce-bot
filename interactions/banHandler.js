const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const db = require('../mysql');

module.exports = {
  customId: 'ban_user',
  async execute(interaction) {
    const userId = interaction.message.embeds[0]?.fields[0]?.value.match(/UserId:\s+`(\d+)`/)?.[1];
    if (!userId) return interaction.reply({ content: 'No se pudo obtener el ID del usuario.', ephemeral: true });

    const modal = new ModalBuilder()
      .setCustomId(`submit_ban_${userId}`)
      .setTitle('Especificar razón del ban');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ban_reason')
      .setLabel('Razón del ban')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};

const db = require('../mysql');

module.exports = {
  isModal: true,
  async execute(interaction) {
    const userId = interaction.customId.split('_')[2];
    const reason = interaction.fields.getTextInputValue('ban_reason');
    const embed = interaction.message.embeds[0];

    await db.query(
      'INSERT INTO bans (userId, username, moderatorId, moderatorTag, reason) VALUES (?, ?, ?, ?, ?)',
      [
        userId,
        embed.fields[0]?.value.match(/Username:\s+`(.*?)`/)?.[1] || 'Unknown',
        interaction.user.id,
        interaction.user.tag,
        reason
      ]
    );

    const newEmbed = embed.toJSON();
    newEmbed.fields.push({
      name: '⚠️ Ban Info',
      value: `Banned by <@${interaction.user.id}>\nReason: \`${reason}\``
    });

    await interaction.update({
      embeds: [newEmbed],
      components: [] // elimina botón
    });

    await interaction.followUp({ content: `Usuario baneado correctamente.`, ephemeral: true });
  }
};

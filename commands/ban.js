const fetch = require('node-fetch');
const config = require('../config.json');

module.exports = {
  name: 'ban',
  description: 'Ban a user manually by userId',
  async execute(interaction) {
    const args = interaction.options?._hoistedOptions || [];
    const userId = args.find(a => a.name === 'userid')?.value;
    const reason = args.find(a => a.name === 'reason')?.value || 'Unspecified';

    if (!config.adminIds.includes(interaction.user.id)) {
      return interaction.reply({ content: '⛔ You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const response = await fetch('https://tu-backend-nforce.onrender.com/api/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unknown error');

      interaction.reply(`✅ User \`${userId}\` has been banned. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Error banning user.', ephemeral: true });
    }
  }
};

const fetch = require('node-fetch');
const config = require('../config.json');

module.exports = {
  name: 'unban',
  description: 'Unban a user by userId',
  async execute(interaction) {
    const args = interaction.options?._hoistedOptions || [];
    const userId = args.find(a => a.name === 'userid')?.value;

    if (!config.adminIds.includes(interaction.user.id)) {
      return interaction.reply({ content: '⛔ You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const response = await fetch(`https://tu-backend-nforce.onrender.com/api/bans/${userId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unknown error');

      interaction.reply(`✅ User \`${userId}\` has been unbanned.`);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Error unbanning user.', ephemeral: true });
    }
  }
};

const fetch = require('node-fetch');

module.exports = {
  name: 'bans',
  description: 'Show the list of all banned users',
  async execute(interaction) {
    try {
      const response = await fetch('https://tu-backend-nforce.onrender.com/api/bans');
      const bans = await response.json();

      if (!Array.isArray(bans) || bans.length === 0) {
        return interaction.reply('📭 No banned users found.');
      }

      const list = bans.map(b => `• \`${b.userId}\` - ${b.reason}`).join('\n').slice(0, 2000);
      interaction.reply(`📄 **Banned Users List:**\n${list}`);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Could not fetch banned users.', ephemeral: true });
    }
  }
};

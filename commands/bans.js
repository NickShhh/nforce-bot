const fetch = require('node-fetch');
module.exports = {
    name: 'bans',
    async execute(interaction) {
        try {
            const response = await fetch(`${process.env.API_URL}/api/bans`);
            const data = await response.json();
            const formatted = data.map(ban => `• ${ban.userId}: ${ban.reason}`).join("\n");
            await interaction.reply({ content: formatted || 'No bans found.', ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Failed to fetch bans.', ephemeral: true });
        }
    }
};
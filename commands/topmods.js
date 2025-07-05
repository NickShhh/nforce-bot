const fetch = require('node-fetch');
module.exports = {
    name: 'topmods',
    async execute(interaction) {
        try {
            const response = await fetch(`${process.env.API_URL}/api/bans/topmods`);
            const data = await response.json();
            const formatted = data.map(mod => `• <@${mod.adminId}>: ${mod.total_bans} bans`).join("\n");
            await interaction.reply({ content: formatted || 'No data.', ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Failed to fetch top moderators.', ephemeral: true });
        }
    }
};
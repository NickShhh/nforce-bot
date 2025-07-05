const fetch = require('node-fetch');
module.exports = {
    name: 'unban',
    async execute(interaction) {
        const userId = interaction.options.getString('input');
        try {
            const response = await fetch(`${process.env.API_URL}/api/bans/${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            await interaction.reply({ content: `✅ ${data.message}`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Failed to unban user.', ephemeral: true });
        }
    }
};
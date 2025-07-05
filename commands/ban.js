const fetch = require('node-fetch');
module.exports = {
    name: 'ban',
    async execute(interaction) {
        const [userId, ...reasonParts] = interaction.options.getString('input').split(" ");
        const reason = reasonParts.join(" ") || "No reason provided";
        const adminId = interaction.user.id;
        try {
            const response = await fetch(`${process.env.API_URL}/api/bans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, reason, adminId })
            });
            const data = await response.json();
            await interaction.reply({ content: `✅ ${data.message}`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: '❌ Failed to ban user.', ephemeral: true });
        }
    }
};
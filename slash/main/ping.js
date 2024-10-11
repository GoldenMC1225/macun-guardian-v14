const { EmbedBuilder, Colors } = require("discord.js");
module.exports = {
    name: "ping",
    description: "Kiểm tra ping của bot",
    options: [],
    run: async (client, interaction) => {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Pong! Độ trễ: ${sent.createdTimestamp - interaction.createdTimestamp}ms \nĐộ trễ của API: ${client.ws.ping}ms`);
    },
};
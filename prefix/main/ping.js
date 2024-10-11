const { EmbedBuilder, Colors } = require("discord.js");
exports.run = async (client, message, args) => {

const msg = await message.reply('Pinging...');
const ping = msg.createdTimestamp - message.createdTimestamp;
msg.edit(`Pong! Độ trễ: ${ping}ms \nĐộ trễ của API: ${client.ws.ping}ms`);

};
exports.conf = {
    aliases: []
};

exports.help = {
    name: "ping"
};

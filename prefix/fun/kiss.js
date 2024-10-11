const axios = require('axios');
const { EmbedBuilder, Colors } = require('discord.js');
exports.run = async (client, message, args) => {
    const user = message.mentions.users.first();
    if (!user) return message.channel.send('Bạn phải tag người cần được hôn!');

    const gif = await axios.get('https://nekos.life/api/v2/img/kiss');

    const embed = new EmbedBuilder()
    .setDescription(`<@${message.author.id}> đã hôn <@${user.id}>`)
    .setImage(gif.data.url)
    .setColor('Random')
    message.channel.send({ embeds: [embed] });
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
};

exports.help = {
    name: "kiss"
};

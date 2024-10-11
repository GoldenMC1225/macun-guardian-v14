const { EmbedBuilder, Colors } = require("discord.js");

exports.run = async (client, message, args) => {
    const logchannel = message.guild.channels.cache.get("844419064407392256");
    const channel = message.mentions.channels.first();
    if (channel) {
        const msg = args.slice(1).join(" ");
        if (!msg) return message.reply("Hãy gửi một lời nhắn nào đó!");
        channel.send(msg);
        return;
    }
    const msg = args.join(" ");
    if (!msg) return message.reply("Hãy gửi một lời nhắn nào đó!");
    const filteredMsg = msg.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere").replace(/<@&[0-9]+>/g, "");
    message.channel.send(filteredMsg);

    const embed = new EmbedBuilder()
    .addFields(
        { name: "Người gửi", value: message.author.tag.toString() },
        { name: "Lời nhắn", value: msg.toString() },
        { name: "Kênh", value: channel ? channel.toString() : message.channel.toString() }
    )
    .setColor(Colors.Green)
    .setTimestamp()
    logchannel.send({ embeds: [embed] });
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    //permission: ""
};

exports.help = {
    name: "say"
};

const { EmbedBuilder, Colors } = require("discord.js");

exports.run = async (client, message, args) => {
    // Get the mentioned user
    const user = message.mentions.users.first();
    if (!user) {
        return message.reply("Tag một người dùng để sử dụng.");
    }

    // Get the guild member object
    const member = message.guild.members.cache.get(user.id);
    if (!member) {
        return message.reply("Người dùng không có trong server này.").then((msg) => { setTimeout(() => msg.delete(), 10000) });
    }

    // Check if the user is already in timeout
    if (member.isCommunicationDisabled()) {
        return message.reply("Người dùng đang bị timeout.").then((msg) => { setTimeout(() => msg.delete(), 10000) });
    }

    // Check if a duration is provided
    const duration = parseInt(args[1]) || parseInt(args[0]) || 60;
    if (isNaN(duration)) {
        return message.reply("Thêm thời gian timeout (giây) vào lệnh.").then((msg) => { setTimeout(() => msg.delete(), 10000) });
    }

    // Timeout the user for the specified duration
    try {
        await member.timeout(duration * 1000);
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`Lỗi: Không thể timeout người dùng này.`)
            .setTimestamp();
        return message.channel.send({ embeds: [embed] }).then((msg) => { setTimeout(() => msg.delete(), 10000) });
    }

    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`<@${user.id}> đã bị timeout trong ${duration} giây.`)
        .setTimestamp();
    message.channel.send({ embeds: [embed] }).then((msg) => { setTimeout(() => msg.delete(), 10000) });
};

exports.conf = {
    aliases: ["mute"],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "MODERATE_MEMBERS"
};

exports.help = {
    name: "timeout"
};

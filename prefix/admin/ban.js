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
        return message.reply("Người dùng không có trong server này.");
    }
    const reason = args.slice(1).join(" ") || "*Cút ra ngoài!* (Không có lý do)";
    try {
        await member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: reason });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`Lỗi: Không thể ban người dùng này.`)
            .setTimestamp()
        return message.channel.send({ embeds: [embed] });
    }

    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`${message.author} đã ban ${user.tag} với lý do: ${reason}`)
        .setImage("https://i.imgur.com/yknPkF6.gif")
        .setTimestamp()
    message.channel.send({embeds: [embed]});
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "BAN_MEMBERS"
};

exports.help = {
    name: "ban"
};

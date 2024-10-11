const { EmbedBuilder, Colors } = require("discord.js");
exports.run = async (client, message, args) => {
    // Get the mentioned user
    const user = message.mentions.users.first();
    if (!user) {
        return message.reply("Tag một người dùng để sử dụng.");
    }

    // Get the guild member object
    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("Người dùng không có trong server này.");
    if (member.id === message.guild.ownerID) return message.channel.send("Bạn không thể kick owner được!");
    if (!member.kickable) return message.channel.send({embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription("**Lỗi: Không thể kick người dùng này.**")]});;
    const reason = args.slice(1).join(" ") || "Bye bye";
    try {
        await member.kick();
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`**Lỗi: Không thể kick người dùng này.**`)
            .setTimestamp()
        return message.channel.send({ embeds: [embed] });
    }

    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`<@${message.author.id}> đã kick <@${user.id}> với lý do: ${reason}`)
        .setTimestamp()
    message.channel.send({embeds: [embed]});
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "KICK_MEMBERS"
};

exports.help = {
    name: "kick"
};

const { EmbedBuilder, Colors } = require("discord.js");
exports.run = async (client, message, args) => {
    const member = args[1]

    try {
        await message.guild.members.unban(member);
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`Lỗi: Không thể unban người dùng này.`)
            .setTimestamp()
        return message.channel.send({ embeds: [embed] });
    }

    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`${message.author} đã unban ${user.tag}`)
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
    name: "unban"
};

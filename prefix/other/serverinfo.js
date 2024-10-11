const { EmbedBuilder, Colors, ChannelType } = require("discord.js");

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const embed = new EmbedBuilder()
        .setTitle(`Thông tin máy chủ`)
        .setColor(Colors.Blurple)
        .setThumbnail(message.guild.iconURL())
        .addFields(
            { name: "Tên Server", value: message.guild.name.toString(), inline: true },
            { name: "Server ID", value: message.guild.id.toString(), inline: true },
            { name: "Chủ Server", value: `<@${message.guild.ownerId.toString()}>`, inline: true },
            { name: "Tổng số thành viên", value: message.guild.memberCount.toString(), inline: true },
            { name: "Tổng số kênh chat", value: message.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size.toString(), inline: true },
            { name: "Tổng số kênh voice", value: message.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size.toString(), inline: true },
            { name: "Tổng số vai trò", value: message.guild.roles.cache.size.toString(), inline: true },
            { name: "Server được tạo ngày", value: message.guild.createdAt.toLocaleString(), inline: true }
        )
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
};

exports.conf = {
    aliases: ["sinfo"],
    cooldown: new Set(),
    cooldownTime: 10,
};

exports.help = {
    name: "serverinfo"
};

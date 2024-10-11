const { EmbedBuilder, Colors } = require("discord.js");
module.exports = {
    name: "avatar",
    description: "Xem avatar của bạn hoặc người khác",
    options: [
        {
            name: "user",
            description: "Người dùng cần xem avatar",
            type: 6,
            required: false
        }
    ],
    run: async (client, interaction) => {

        const member = interaction.options.getUser("user") || interaction.user;

        const embed = new EmbedBuilder()
        .setDescription(`**[PNG](${member.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "png")}) | [JPG](${member.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "jpg")}) | [WEBP](${member.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "webp")}) | [GIF](${member.displayAvatarURL({ dynamic: true, size: 1024 }).replace("webp", "gif")})**`)
        .setImage(member.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(Colors.Blue)
        .setTimestamp()
        return interaction.reply({ embeds: [embed]}).catch(err => {})

    },
    };
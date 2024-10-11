exports.run = async (client, message, args) => {
    // Check if the bot has permission to kick users from the voice channel
    if (!message.member.voice.channel.permissionsFor(message.guild.me).has("MOVE_MEMBERS")) {
        return message.reply("Tôi không thể kick người dùng này là được.");
    }

    // Get the mentioned user
    const user = message.mentions.users.first();
    if (!user) {
        return message.reply("You need to mention a user to kick from the voice channel.");
    }

    // Get the voice state of the mentioned user
    const member = message.guild.member(user);
    if (!member.voice.channel) {
        return message.reply("Người dùng không có trong voice chat.");
    }

    // Kick the user from the voice channel
    member.voice.kick();

    message.reply(`Đã kick ${user.tag} khỏi voice chat.`);
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "MOVE_MEMBERS"
};

exports.help = {
    name: "kickvc"
};

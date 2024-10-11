const client = require("../index.js");

client.on("messageDelete", async (message) => {
    // Get the channel where you want to log the deleted messages
    const logChannel = client.channels.cache.get("CHANNEL_ID");

    // Check if the log channel exists and is a text channel
    if (logChannel && logChannel.type === "text") {
        // Create an embed to display the deleted message information
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Tin nhắn bị xoá")
            .addField("Author", message.author.tag, true)
            .addField("Channel", message.channel.name, true)
            .addField("Content", message.content || "*Không có nội dung*")
            .setTimestamp();

        // Check if the deleted message had any attachments
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            embed.addField("Tệp đính kèm", attachment.url);
        }

        // Send the embed to the log channel
        logChannel.send(embed);
    }
});

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.reply("Nhập số lượng tin nhắn cần xoá (1-100).").then((msg) => {setTimeout(() => msg.delete(), 5000)});
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0 || amount > 100) {
        return message.reply("Nhập số lượng tin nhắn cần xoá (1-100).").then((msg) => {setTimeout(() => msg.delete(), 5000)});
    }

    try {
        const fetchedMessages = await message.channel.messages.fetch({ limit: amount + 1 });
        const deletableMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000); // 14 days in milliseconds
        await message.channel.bulkDelete(deletableMessages);
        message.channel.send(`Đã xoá ${deletableMessages.size - 1} tin nhắn.`).then((msg) => {setTimeout(() => msg.delete(), 5000)});
    } catch (error) {
        console.error(error);
        message.channel.send("Xảy ra lỗi khi cố xoá tin nhắn").then((msg) => {setTimeout(() => msg.delete(), 5000)});
    }
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "MANAGE_MESSAGES"
};

exports.help = {
    name: "purge"
};

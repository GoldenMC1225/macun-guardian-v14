const client = require("../index.js");

client.on("guildMemberRemove", async (member) => {
    if (member.guild.id === "680270193167171678"){
        member.guild.channels.cache.get("680293354101145619").send(`**${member.user.globalName}** bye bye ~~, cảm ơn bạn đã tham gia server của bọn mình`);
    }
});

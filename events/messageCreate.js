const config = require("../config.js");
const client = require("../index.js");

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  const command = message.content
    .toLocaleLowerCase()
    .split(" ")[0]
    .slice(config.prefix.length);
  const params = message.content.split(" ").slice(1);
  let cmd;
  if (client.prefixCommands.has(command)) {
    cmd = client.prefixCommands.get(command);
  } else if (client.prefixAliases.has(command)) {
    cmd = client.prefixCommands.get(client.prefixAliases.get(command));
  }
  if (cmd) {
    // Check if the command has a cooldown
    if (cmd.conf.cooldown && cmd.conf.cooldown.has(message.author.id)) {
      return message.reply("Hãy đợi để có thể tiếp tục sử dụng lệnh.").then((msg) => {setTimeout(() => msg.delete(), 5000)});
    }

    // Check if the user has the required permission or is an Administrator
    if (
      cmd.conf.permission &&
      !message.member.permissions.has(cmd.conf.permission) &&
      !message.member.permissions.has("ADMINISTRATOR") &&
      !message.author.id === config.ownerID
    ) {
      return message.reply("Bạn không có quyền sử dụng lệnh này.").then((msg) => {setTimeout(() => msg.delete(), 5000)});
    }

    // Add the user to the cooldown list
    if (cmd.conf.cooldown) {
      cmd.conf.cooldown.add(message.author.id);
      setTimeout(() => {
        cmd.conf.cooldown.delete(message.author.id);
      }, cmd.conf.cooldownTime * 1000);
    }

    // Execute the command
    cmd.run(client, message, params);
  }
});
const { inspect } = require("node:util");
const config = require("../../config.js");

exports.run = async (client, message, args) => {
    if (message.author.id !== config.ownerID) return;

    // This function cleans up and prepares the
    // result of our eval command input for sending
    // to the channel
    const clean = async (text) => {
        // If our input is a promise, await it before continuing
        if (text && text.constructor.name == "Promise")
            text = await text;

        // If the response isn't a string, `util.inspect()`
        // is used to 'stringify' the code in a safe way that
        // won't error out on objects with circular references
        // (like Collections, for example)
        if (typeof text !== "string")
            text = require("util").inspect(text, { depth: 1 });

        // Replace symbols with character code alternatives
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));

        // Send off the cleaned up result
        return text;
    }

    try {
        const code = args.join(" ");
        let evaled = await eval(code);

        const cleaned = await clean(evaled);

        // if (typeof evaled !== "string") {
        //     evaled = await inspect(evaled);
        // }

        message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
        //console.error(err);
        //message.channel.send(`Error: \`\`\`js\n${err.message}\n\`\`\``);
        message.channel.send(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
    }
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "ADMINISTRATOR"
};

exports.help = {
    name: "eval",
}
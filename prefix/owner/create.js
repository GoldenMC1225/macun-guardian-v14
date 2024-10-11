const { ChannelType, PermissionFlagsBits } = require("discord.js");
const config = require("../../config.js");

exports.run = async (client, message, args) => {
    const name = args.join(" ");
    message.guild.channels.create({
        name: name,
        parent: config.personcate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: message.author.id, // Change to player ID
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: config.masterRole,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: message.guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            }
        ],
    })
    .then(channel => {
        const channelID = channel.id
    })
    .catch(console.error);
    message.channel.send(`Channel ${name} created!`);
};

exports.conf = {
    aliases: [],
    cooldown: new Set(),
    cooldownTime: 10,
    permission: "ADMINISTRATOR"
};

exports.help = {
    name: ""
};

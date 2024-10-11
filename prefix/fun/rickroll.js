exports.run = async (client, message, args) => {
    message.channel.send("[<Rickrolled:865578789965922324><Rickrolled:865578789965922324><Rickrolled:865578789965922324>](https://www.youtube.com/watch?v=dQw4w9WgXcQ)");
};

exports.conf = {
    aliases: ["rr"],
    cooldown: new Set(),
    cooldownTime: 10,
    //permission: ""
};

exports.help = {
    name: "rickroll"
};

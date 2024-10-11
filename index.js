require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    partials: [
        Partials.Message, // for message
        Partials.Channel, // for text channel
        Partials.GuildMember, // for guild member
        Partials.Reaction, // for message reaction
        Partials.GuildScheduledEvent, // for guild events
        Partials.User, // for discord user
        Partials.ThreadMember, // for thread member
    ],
    intents: [
        GatewayIntentBits.Guilds, // for guild related things
        GatewayIntentBits.GuildMembers, // for guild members related things
        GatewayIntentBits.GuildInvites, // for guild invite managing
        GatewayIntentBits.GuildVoiceStates, // for voice related things
        GatewayIntentBits.GuildPresences, // for user presence things
        GatewayIntentBits.GuildMessages, // for guild messages things
        GatewayIntentBits.GuildMessageReactions, // for message reactions things
        GatewayIntentBits.GuildMessageTyping, // for message typing things
        GatewayIntentBits.MessageContent, // enable if you need message content things
    ],
});

module.exports = client;

var gameStatus = 0;
client.gameStatus = gameStatus;

var specialTeam = "";
var specialTeamList = [];
client.specialTeam = specialTeam;
client.specialTeamList = specialTeamList;

var specialInteraction = ""; // Tương tác đặc biệt
client.specialInteraction = specialInteraction;

//event handler
const fs = require("node:fs");
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    require(`./events/${file}`);
    console.log(`
    \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ \x1b[0m
    \x1b[34;1m➤ | ${file} Event Loadded! \x1b[0m
    \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ \x1b[0m
    `)
}


client.login(process.env.TEST_BOT_TOKEN).catch(e => {
    console.log(`
    \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ \x1b[0m
    \x1b[31;43;1m✕ | Invalid Discord Bot Token!\x1b[0m
    \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ \x1b[0m
`)
})


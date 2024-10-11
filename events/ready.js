require("dotenv").config();
const client = require("../index");
const { Collection, ActivityType, PresenceUpdateStatus } = require("discord.js")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("node:fs")
const path = require("node:path");
const config = require("../config.js");

client.on("ready", () => {
    client.prefixCommands = new Collection();
    client.prefixAliases = new Collection();
    client.slashCommands = new Collection();
    const slashCommandsLoader = []


    // Prefix Commands Loadder //
    const prefixCommandFolders = fs.readdirSync('./prefix');
    for (const folder of prefixCommandFolders) {
        const folderPath = path.join('./prefix', folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const props = require(`../${filePath}`);

            console.log(`\x1b[34;1m➤ Prefix | ${props.help.name}/${folder} Command Loadded! \x1b[0m`)
            client.prefixCommands.set(props.help.name, props);

            // biome-ignore lint/complexity/noForEach: <explanation>
            props.conf.aliases.forEach(alias => {
                client.prefixAliases.set(alias, props.help.name);
            });
        }
    }
    // Prefix Commands Loadder //

    // Slash Commands Loadder //
    const slashCommandFolders = fs.readdirSync('./slash');
    for (const folder of slashCommandFolders) {
        const folderPath = path.join('./slash', folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const props = require(`../${filePath}`);

            client.slashCommands.set(props.name, props);
            slashCommandsLoader.push({
                name: props.name,
                description: props.description,
                options: props.options
            });
            console.log(`\x1b[34;1m➤ Slash | ${props.name}/${folder} Command Loadded! \x1b[0m`)

        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TEST_BOT_TOKEN);
    rest.put(Routes.applicationCommands(process.env.TEST_BOT_CLIENT), { body: [] })
        .then(() => console.log('\x1b[34;1mSuccessfully deleted all application [/] commands.\x1b[0m'))
        .catch(console.error);
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await slashCommandsLoader,
            });
            console.log("\x1b[34;1mSuccessfully loadded application [/] commands.\x1b[0m");
        } catch (e) {
            console.log(`\x1b[31;43;1mFailed to load application [/] commands. ${e}\x1b[0m`);
        }
    })();
    // Slash Commands Loadder //

    console.log(`
        \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     \x1b[0m
        \x1b[34;1m➤ | ${client.user.tag} Online!              \x1b[0m 
        \x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━	   \x1b[0m
    `)
    client.user.setPresence({ activities: [{ name: config.botStatus }], status: PresenceUpdateStatus.Online });

    process.title = config.botStatus
});
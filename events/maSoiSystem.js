require("dotenv").config();
const client = require("../index");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Component, ComponentType } = require("discord.js")
const config = require("../config.js");
const fsFunc = require("../function/readWriteFile.js");

client.on("ready", async () => {
    const dangKy = client.channels.cache.get(config.dangky);
    const dangKyMSG = await dangKy.messages.fetch();
    if (!dangKy) {
        console.log("\x1b[31;43;1m✕ | Kênh không tồn tại!\x1b[0m");
        return;
    }
    const botMessages = dangKyMSG.filter(
        (message) => message.author.id === client.user.id
    );
    const firstMSG = botMessages.first();
    const row = new ActionRowBuilder();
    row.addComponents(
        new ButtonBuilder().setCustomId("player").setLabel("Người Chơi").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("audience").setLabel("Khán Giả").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("master").setLabel("Quản Trò").setStyle(ButtonStyle.Danger)
    );

    const msgData = {
        embeds: [{
            title: "Bấm nút để có thể tham gia trò chơi",
            description: "Sử dụng các nút bên dưới để có thể trở thành người chơi hoặc khán giả nhé!",
            color: 65535
        }],
        components: [row]
    }
    if (!firstMSG) dangKy.send(msgData);

    // QUẢN TRÒ
    const quanLenh = client.channels.cache.get(config.quanlenh);
    const quanLenhMSG = await quanLenh.messages.fetch();
    if (!quanLenh) {
        console.log("\x1b[31;43;1m✕ | Kênh không tồn tại!\x1b[0m");
        return;
    }
    const botMessagesQL = quanLenhMSG.filter(
        (message) => message.author.id === client.user.id
    );
    const firstMSGQL = botMessagesQL.first();
    const rowQL = new ActionRowBuilder();
    rowQL.addComponents(
        new ButtonBuilder().setCustomId("open").setLabel("Mở Game").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("start").setLabel("Bắt Đầu Game").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("end").setLabel("Kết Thúc").setStyle(ButtonStyle.Danger)
    );
    const msgDataQL = {
        embeds: [{
            title: "Bấm nút để quản lý game",
            description: "Sử dụng các nút bên dưới để mở game, bắt đầu game, kết thúc game.",
            color: 65535
        }],
        components: [rowQL]
    }
    if (!firstMSGQL) quanLenh.send(msgDataQL);
})

const createSelectMenu = (roles, customId, placeholder) => {
    const rolesOptions = roles.map(role => new StringSelectMenuOptionBuilder()
        .setLabel(role.name)
        .setDescription(`Chỉ số cân bằng: ${role.score}`)
        .setValue(role.id.toString())
    );

    const selectMenus = [];
    for (let i = 0; i < rolesOptions.length; i += 25) {
        const chunk = rolesOptions.slice(i, i + 25);
        selectMenus.push(new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`${customId}_${i / 25}`)
                .setPlaceholder(placeholder)
                .addOptions(chunk)
                .setMinValues(1)
                .setMaxValues(chunk.length)
        ));
    }
    return selectMenus;
};

// Function to create all select menus
const createAllSelectMenus = (rolesDB) => {
    const danRoles = rolesDB.roles.filter(role => role.team === 'Dân');
    const soiRoles = rolesDB.roles.filter(role => role.team === 'Sói');
    const soloRoles = rolesDB.roles.filter(role => role.team === 'Solo');

    const danSelectMenus = createSelectMenu(danRoles, 'selectRole_dan', 'Chọn vai trò Dân');
    const soiSelectMenus = createSelectMenu(soiRoles, 'selectRole_soi', 'Chọn vai trò Sói');
    const soloSelectMenus = createSelectMenu(soloRoles, 'selectRole_solo', 'Chọn vai trò Solo');

    return [...danSelectMenus, ...soiSelectMenus, ...soloSelectMenus];
};

const rolesManager = {
    embeds: [{
        author: {
            name: "Quản lý vai trò game"
        },
        title: "Danh sách vai trò được thêm",
        color: 65280,
        description: "",
        footer: {
            text: "",
        }
    }]
};

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.isButton()) {
        const macunServer = await client.guilds.fetch(config.unkserver);
        const macunMember = await macunServer.members.fetch(interaction.member.id);

        if (interaction.customId === "player") {
            if (interaction.member.roles.cache.has(config.audienceRole)) {
                // interaction.member.roles.remove(config.audienceRole);
                return interaction.reply({ content: "Bạn đã là Người Chơi rồi!", ephemeral: true });
            }
            interaction.member.roles.add(config.playerRole);
            interaction.reply({ content: "Bạn đã trở thành Người Chơi!", ephemeral: true });
            try {
                const maSoiDB = await fsFunc.readFile("./database/masoi.json");
                if (maSoiDB) {
                    const curGameCount = maSoiDB.gameCount;
                    const curPlayerCount = maSoiDB.game[curGameCount].playerCount + 1;
                    maSoiDB.game[curGameCount].playerCount = curPlayerCount;
                    maSoiDB.game[curGameCount].players[curPlayerCount] = {
                        "playerId": interaction.member.id,
                        "channelId": NaN,
                        "name": interaction.member.user.username,
                        "role": NaN,
                        "team": "",
                        "status": 1,
                    }
                    fsFunc.writeFile("./database/masoi.json", JSON.stringify(maSoiDB), (err) => {
                        if (err) return console.error(err);
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        else if (interaction.customId === "audience") {
            if (interaction.member.roles.cache.has(config.playerRole)) return;
            if (interaction.member.roles.cache.has(config.audienceRole)) {
                // interaction.member.roles.remove(config.audienceRole);
                return interaction.reply({ content: "Bạn đã là Khán Giả rồi!", ephemeral: true });
            }
            interaction.member.roles.add(config.audienceRole);
            interaction.reply({ content: "Bạn đã trở thành Khán Giả!", ephemeral: true });
        }
        else if (interaction.customId === "master") {
            if (interaction.member.roles.cache.has(config.masterRole)) {
                interaction.member.roles.remove(config.masterRole);
                interaction.reply({ content: "Đã xoá role Quản Trò!", ephemeral: true });
            }
            if (macunMember.roles.cache.has(config.masterTestRole)) {
                interaction.member.roles.add(config.masterRole);
                interaction.reply({ content: "Bạn đã trở thành Quản Trò!", ephemeral: true });
            } else {
                interaction.reply({ content: "Bạn không phải là Quản trò!", ephemeral: true });
            }
        }

        // QUẢN TRÒ
        if (interaction.member.roles.cache.has(config.masterRole)) {
            if (interaction.customId === "open") {
                client.gameStatus = 1;
                try {
                    const maSoiDB = await fsFunc.readFile("./database/masoi.json");
                    if (maSoiDB) {
                        const curGameCount = maSoiDB.gameCount + 1;
                        maSoiDB.gameCount = curGameCount;
                        maSoiDB.game[curGameCount] = {
                            "playerCount": 0,
                            "players": {},
                            "status": 1,
                            "time": new Date().getTime(),
                            "winner": "",
                        };
                        await fsFunc.writeFile("./database/masoi.json", maSoiDB);
                    }
                } catch (err) {
                    console.error(err);
                }

                try {
                    const rolesDB = await fsFunc.readFile("./database/roles.json");
                    if (rolesDB) {
                        var selectMenus = createAllSelectMenus(rolesDB);

                        var menuMSG = await interaction.reply({
                            embeds: [rolesManager.embeds[0]],
                            components: selectMenus,
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            else if (interaction.customId === "start") {
                if (client.gameStatus === 1) {
                    client.gameStatus = 2;
                    try {
                        const maSoiDB = await fsFunc.readFile("./database/masoi.json");
                        if (maSoiDB) {
                            const curGameCount = maSoiDB.gameCount;
                            maSoiDB.game[curGameCount].status = 2;
                            await fsFunc.writeFile("./database/masoi.json", maSoiDB);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    interaction.reply({ content: "Game đã bắt đầu!", ephemeral: true });
                } else {
                    interaction.reply({ content: "Game chưa mở!", ephemeral: true });
                }
            }
            else if (interaction.customId === "end") {
                if (client.gameStatus === 2) {
                    client.gameStatus = 3;
                    try {
                        const maSoiDB = await fsFunc.readFile("./database/masoi.json");
                        if (maSoiDB) {
                            const curGameCount = maSoiDB.gameCount;
                            maSoiDB.game[curGameCount].status = 3;
                            await fsFunc.writeFile("./database/masoi.json", maSoiDB);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    interaction.reply({ content: "Game đã kết thúc!", ephemeral: true });
                } else {
                    interaction.reply({ content: "Game chưa bắt đầu!", ephemeral: true });
                }
            }
        }
    }
    if (interaction.isButton() && client.gameStatus === 2) {
        if (interaction.customId === "player") {
            interaction.reply({ content: "Trò chơi đã bắt đầu, không thể tham gia!", ephemeral: true });
        } else if (interaction.customId === "audience" && !interaction.member.roles.cache.has(config.playerRole)) {
            interaction.member.roles.add(config.audienceRole);
            interaction.reply({ content: "Bạn đã trở thành khán giả", ephemeral: true });
        }
    }
})

const selectedRolesState = {
    dan: [],
    soi: [],
    solo: []
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith('selectRole')) {
            const selectedValues = interaction.values;
            // Determine the team based on the customId
            let team;
            if (interaction.customId.includes('dan')) {
                team = 'dan';
            } else if (interaction.customId.includes('soi')) {
                team = 'soi';
            } else if (interaction.customId.includes('solo')) {
                team = 'solo';
            }

            // Update the state with the new selections
            const rolesDB = await fsFunc.readFile("./database/roles.json");
            selectedRolesState[team] = selectedValues.map(roleId => {
                const role = rolesDB.roles.find(r => r.id.toString() === roleId);
                return {
                    roleId: role.id,
                    roleName: role.name,
                    roleScore: role.score,
                    roleTeam: role.team
                };
            });

            // Combine all selected roles
            const allSelectedRoles = [...selectedRolesState.dan, ...selectedRolesState.soi, ...selectedRolesState.solo];

            // Calculate the total score
            const totalScore = allSelectedRoles.reduce((sum, role) => sum + role.roleScore, 0);

            // Create a description of the selected roles, split by teams
            const danDescriptions = selectedRolesState.dan.map(role => `${role.roleName} (Chỉ số cân bằng: ${role.roleScore})`).join('\n');
            const soiDescriptions = selectedRolesState.soi.map(role => `${role.roleName} (Chỉ số cân bằng: ${role.roleScore})`).join('\n');
            const soloDescriptions = selectedRolesState.solo.map(role => `${role.roleName} (Chỉ số cân bằng: ${role.roleScore})`).join('\n');

            const selectedRolesDescriptions = `===== Phe Dân =====\n${danDescriptions}\n\n===== Phe Sói =====\n${soiDescriptions}\n\n===== Phe Solo =====\n${soloDescriptions}`;

            // Update the embed with the combined list of selected roles and total score
            rolesManager.embeds[0].description = selectedRolesDescriptions;
            rolesManager.embeds[0].footer.text = `Chỉ số cân bằng: ${totalScore}`;

            await interaction.deferUpdate();
            await interaction.editReply({
                content: `${totalScore > 5 || totalScore < -5 ? "Game không cân bằng" : ""}`,
                embeds: [rolesManager.embeds[0]],
                components: interaction.message.components
            });
        }
    }
});

// 0 = not open
// 1 = open
// 2 = playing (closed)
// 3 = end
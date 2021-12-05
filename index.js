const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const got = require("got");
const mojang = require("mojangjs");
const prefix = config.prefix;
const hypixeltoken = config.hypixel_token;

const { isValidNickname } = require('./utilll');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.mentions.has(client.user.id) && !message.content.includes("@everyone") && !message.content.includes("@here")) {
        return message.channel.send(`\nMy prefix for \`${message.guild.name}\` is \`${prefix}\`!`);
    }

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === `${prefix}s` || command === `${prefix}stats`) {
        const roleColor = message.guild.me.roles.highest.hexColor
            if (!args[0]) {
                return message.channel.send("who are you looking for lmao");
            }
        const nickname = args[0];

        if (!isValidNickname(nickname)) {
            return message.reply(
                'the nickname is invalid smh my head'
            );
        }

        mojang
            .getUUID(nickname)
            .then(uuid => {
                got(`https://api.hypixel.net/player?key=${hypixeltoken}&uuid=${uuid}`).then(response => {
                    let content = JSON.parse(response.body);
                    let kills = content.player.achievements.arcade_ctw_slayer;
                    let caps = content.player.achievements.arcade_ctw_oh_sheep;
		    let achievements_ids = content.player.achievementsOneTime;
                    let achievementsar = [];
                    if (achievements_ids.includes("arcade_ctw_no_need")) achievementsar.push("No need");
                    if (achievements_ids.includes("arcade_ctw_hey_there")) achievementsar.push("Hey there");
                    if (achievements_ids.includes("arcade_ctw_first")) achievementsar.push("First");
                    if (achievements_ids.includes("arcade_ctw_comeback")) achievementsar.push("Comeback");
                    if (achievements_ids.includes("arcade_ctw_ninja")) achievementsar.push("Ninja");
                    if (achievements_ids.includes("arcade_ctw_fashionably_late")) achievementsar.push("Fashionably late");
                    if (achievements_ids.includes("arcade_ctw_safety_is_an_illusion")) achievementsar.push("Safety is an illusion");
                    if (achievements_ids.includes("arcade_ctw_mvp")) achievementsar.push("MVP");
                    if (achievements_ids.includes("arcade_ctw_i_can_be_anything")) achievementsar.push("I can be anything");
                    if (achievements_ids.includes("arcade_ctw_magician")) achievementsar.push("Magician");
                    if (achievements_ids.includes("arcade_ctw_right_place_right_time")) achievementsar.push("Right place, right time");
                    let achivement_pos = 11;
		
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setTitle(`${nickname}'s Stats`)
                            .setColor(roleColor === "#000000" ? "#ffffff" : roleColor)
                            .setDescription(`Captures: **${caps}**\nKills/Assists: **${kills}**\nAchivements: **${achievementsar.length}/${achivement_pos}**`)
                            .setThumbnail(`https://visage.surgeplay.com/bust/512/${uuid.toString()}`)
                    );
                })
            }).catch(console.error);
    }

})

client.login(config.token);

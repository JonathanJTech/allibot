const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register user with Allibot'),
    async execute(interaction) {
        if (!interaction.member.nickname){
            interaction.reply({ content: "Please set your nickname to your Maplestory IGN before registering with Allibot" });
            return;
        }
        // check if friends.json exists
        if (!fs.existsSync(path.join(__dirname, "..", "data", 'friends.json'))) {
            // if not, create it
            fs.writeFileSync(path.join(__dirname, "..", "data", 'friends.json'), JSON.stringify({}));
        }

        const allowedSenders = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", 'friends.json'), 'utf8'));
        const sender = interaction.user.username;
        allowedSenders[sender] = interaction.member.nickname;
        // write the updated allowedSenders back to friends.json
        fs.writeFileSync(path.join(__dirname, "..", "data", 'friends.json'), JSON.stringify(allowedSenders, null, '\t'));
        interaction.reply({ content: `You have been registered as ${allowedSenders[sender]}.`});
    },
};

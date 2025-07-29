const { SlashCommandBuilder } = require('discord.js');

const { ownerId } = require('../config.json');

const historylogger = require('../historylogger.js');

const path = require('node:path');
const historyFilePath = path.join(__dirname, "..", 'history.txt');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wipe')
		.setDescription('Wipes Allibot\'s short term memory'),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
			await interaction.reply('I am a goldfish...');
			historylogger.write(historyFilePath);
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

const { SlashCommandBuilder } = require('discord.js');
const game = require("../src/adventure/game.js");
const vars = require('../src/adventure/vars.js');
const { ownerId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Starts the game'),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
			await interaction.reply("Starting the game...");
			vars.channel = interaction.channel;
			game.startGame();
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

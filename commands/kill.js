const { SlashCommandBuilder } = require('discord.js');

const { ownerId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Shuts down Allibot'),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
			await interaction.reply('Shutting down!');
			process.exit(0);
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

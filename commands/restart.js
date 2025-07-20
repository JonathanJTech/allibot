const { SlashCommandBuilder } = require('discord.js');

const { ownerId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts Allibot'),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
			await interaction.reply('Restarting!');
			process.exit(1); // Use exit code 1 to indicate a restart, handled by systemctl
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

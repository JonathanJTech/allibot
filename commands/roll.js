const { SlashCommandBuilder } = require('discord.js');

const { ownerId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a number between 1 and a specified maximum')
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('The maximum number to roll (default is 100)')
                .setRequired(false)),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
            const max = interaction.options.getInteger('max') || 100;
            const random = Math.floor(Math.random() * max) + 1;
			await interaction.reply("Rolling a " + max + "-sided dice, and rolled a " + random + "!");
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

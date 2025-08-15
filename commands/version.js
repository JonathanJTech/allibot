const { SlashCommandBuilder } = require('discord.js');
const { exec, execSync } = require('child_process');

const { ownerId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Prints the current version number of Allibot'),
	async execute(interaction) {
		if (interaction.user.id == ownerId){
            const botVersion = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).split(/[: ]+/)[0].trim();
			const promptsVersion = execSync('git log -1 --pretty=%B', { cwd: 'allibot-prompts', encoding: 'utf8' }).split(/[: ]+/)[0].trim();
            interaction.reply(`Allibot Version: ${botVersion}\nPrompts Version: ${promptsVersion}`);
		} else {
			await interaction.reply('You do not have permission to use this command!');
		}
	},
};

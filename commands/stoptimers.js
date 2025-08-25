const { SlashCommandBuilder } = require('discord.js');

const { stopTimers } = require('../src/timer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stoptimers')
        .setDescription('Stop all of your timers'),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const message = interaction.options.getString('message');
        const repeating = interaction.options.getBoolean('repeating') || false;

        stopTimers(interaction);
    },
};

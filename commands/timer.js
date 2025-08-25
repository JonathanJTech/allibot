const { SlashCommandBuilder } = require('discord.js');

const { startTimer } = require('../src/timer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Create a timer that will send a message after a specified number of minutes. Use /stoptimers to stop all your timers.')
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('The number of minutes to wait before sending the message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send when the timer is up')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('repeating')
                .setDescription('Whether the timer should repeat after sending the message')
                .setRequired(false)),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const message = interaction.options.getString('message');
        const repeating = interaction.options.getBoolean('repeating') || false;

        startTimer(interaction, minutes, message, repeating);
    },
};

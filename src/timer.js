const repeats = {};

async function startTimer(interaction, minutes, message, repeating){
    if (minutes <= 0) {
        await interaction.reply('Please provide a positive number of minutes for the timer.');
        return;
    }

    await interaction.reply(`Timer set for ${minutes} minute(s). I will send the message: "${message}"${repeating ? ' repeatedly' : ''}.`);

    const sendMessage = async () => {
        //Send a DM to the user
        try {
            await interaction.user.send(message);
        } catch (error) {
            console.error('Error sending DM:', error);
            await interaction.followUp('I was unable to send you a DM. Please check your privacy settings.');
        }
    };

    if (repeating) {
        if (!repeats[interaction.user.id]) {
            repeats[interaction.user.id] = [];
        }
        repeats[interaction.user.id].push(setInterval(sendMessage, minutes * 60 * 1000));
    } else {
        setTimeout(sendMessage, minutes * 60 * 1000);
    }
}

async function stopTimers(interaction) {
    if (repeats[interaction.user.id]) {
        for (const intervalId of repeats[interaction.user.id]) {
            clearInterval(intervalId);
        }
        delete repeats[interaction.user.id];
    }
    await interaction.reply('All your timers have been stopped.');
}

module.exports = { startTimer, stopTimers };
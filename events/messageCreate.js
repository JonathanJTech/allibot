const respond = require("../src/respond.js");
const vars = require('../src/adventure/vars.js');
const game = require("../src/adventure/game.js");

const { ownerId } = require('../config.json');

module.exports = {
    name: "messageCreate",
    execute(message) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Ignore messages that are not in the "allibot" channel or do not mention "allibot"
        if (message.channel.name !== "allibot") return;
        if (!message.content.toLowerCase().includes("allibot")) return;

        if (vars.gaming) {
            // Check if message is a direct message from ownerId
            if (!message.guildId && message.author.id === ownerId) {
                let msg = message.content.toLowerCase();
            } else {
                game.respond(message);
            }
        } else {
            respond.sendResponse(message);
        }
    }
}
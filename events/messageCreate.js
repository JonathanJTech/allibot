const respond = require("../src/respond.js");

module.exports = {
    name: "messageCreate",
    execute(message) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Ignore messages that are not in the "allibot" channel or do not mention "allibot"
        if (message.channel.name !== "allibot") return;
        if (!message.content.toLowerCase().includes("allibot") && !message.content.toLowerCase().includes("アリボット")) return;

        respond.sendResponse(message);
    }
}
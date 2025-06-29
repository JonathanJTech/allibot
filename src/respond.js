const { OpenAI } = require('openai');
const { openai_key } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const description = fs.readFileSync(path.join(__dirname, "..", "events", "prompts", 'Allibot-Description'), 'utf8');
const chats = fs.readFileSync(path.join(__dirname, "..", "events", "prompts", 'Allionna-Chats'), 'utf8');

const friends = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", 'friends.json'), 'utf8'));

const logger = require('../logger.js');

let history = "";

const sendResponse = async (message) => {
    if (!friends[message.author.username]) return;

    const friend = friends[message.author.username];

    const openai = new OpenAI({
        apiKey: openai_key
    });

    let systemMessage = chats + "\n\n" + description;

    // If history.txt is more than 30 minutes old, log it
    const historyFilePath = path.join(__dirname, "..", 'history.txt');
    if (fs.existsSync(historyFilePath)) {
        const stats = fs.statSync(historyFilePath);
        const fileAge = Date.now() - stats.mtimeMs;

        // Check if the file is older than 30 minutes (1800000 milliseconds)
        if (fileAge > 1800000) {
            // append history.txt to historylog.txt
            const historyLogPath = path.join(__dirname, "..", 'historylog.txt');
            if (fs.existsSync(historyLogPath)) {
                const oldHistory = fs.readFileSync(historyFilePath, 'utf8');
                fs.appendFileSync(historyLogPath, "Logging history at " + new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false}) + oldHistory + "\n\n");
            } else {
                fs.writeFileSync(historyLogPath, fs.readFileSync(historyFilePath, 'utf8') + "\n\n");
            }
            fs.unlinkSync(historyFilePath);
            fs.writeFileSync(path.join(__dirname, "..", 'history.txt'), '');
        }
    } else {
        fs.writeFileSync(path.join(__dirname, "..", 'history.txt'), '');
    }

    // Read the history from the file
    history = fs.readFileSync(path.join(__dirname, "..", 'history.txt'), 'utf8');

    if (history) {
        systemMessage += "\n\n" + "Here is the conversation so far. If there is anything worth incorporating into your response, you should incorporate it:" + "\n" + history;
    }

    const response = await openai.responses.create({
        model: "gpt-4.1-mini-2025-04-14",
        input: [
            {
                role: "system",
                content: systemMessage
            },
            {
                role: "user",
                content: friend + ": " + message.content
            }
        ],
    });

    history += "\n" + friend + ": " + message.content + "\n";
    history += "Allibot: " + response.output[0].content[0].text;

    // Write the updated history back to the file
    fs.writeFileSync(path.join(__dirname, "..", 'history.txt'), history);

    message.reply({
        content: response.output[0].content[0].text,
        allowedMentions: { users: [message.author.id] }
    });
}

const respond = {
    "sendResponse": sendResponse
};

module.exports = respond;
const { OpenAI } = require('openai');
const { openai_key, env } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const logger = require('../logger.js');
const historylogger = require('../historylogger.js');

const openai = new OpenAI({
    apiKey: openai_key
});

const promptsPath = path.join(__dirname, "..", "allibot-prompts");

const getRelevantFriendsArray = async (message, sender) => {
    const friendsList = fs.readFileSync(path.join(promptsPath, 'Friends-List'), 'utf8');

    const response = await openai.responses.create({
        model: "gpt-4.1-mini-2025-04-14",
        input: [
            {
                role: "system",
                content: friendsList + "\n\nGive me a comma-separated list (with no spaces) of the primary names of all people that are relevant in this conversation. If there are none, respond with an empty string. Do not respond with any other person's name."
            },
            {
                role: "user",
                content: sender + ": " + message.content
            }
        ],
    });

    return response.output[0].content[0].text.toLowerCase();
}

const buildSystemMessage = async (message, sender) => {
    const description = fs.readFileSync(path.join(promptsPath, 'Allibot-Description'), 'utf8');
    const chats = fs.readFileSync(path.join(promptsPath, 'Allionna-Chats'), 'utf8');

    let systemMessage = chats + "\n\n" + description;

    const alwaysFriendsPath = path.join(promptsPath, "alwaysFriends");
    const alwaysFriends = fs.readdirSync(alwaysFriendsPath);
    for (const file of alwaysFriends) {
        systemMessage += "\n\n" + fs.readFileSync(path.join(alwaysFriendsPath, file), 'utf8');
    }

    const friends = await getRelevantFriendsArray(message, sender);
    logger.debug("Messaged contained these friends: " + friends);
    for (const friend of friends.split(',')){
        if (friend.trim() === "") continue; // Skip empty strings
        const friendFilePath = path.join(promptsPath, "friends", friend);
        if (fs.existsSync(friendFilePath)) {
            systemMessage += "\n\n" + fs.readFileSync(friendFilePath, 'utf8');
        } else {
            logger.warn(`Did not find file for ${friend} at ${friendFilePath}.`);
        }
    }

    systemMessage += "\n\n" + fs.readFileSync(path.join(promptsPath, "Allibot-Instruction"), 'utf8');

    return systemMessage;
}

const sendResponse = async (message) => {
    const allowedSenders = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", 'friends.json'), 'utf8'));

    logger.info("Received message from " + message.author.username);
    if (!allowedSenders[message.author.username]) {
        logger.info("Message from " + message.author.username + " is not allowed. Ignoring.");
        message.reply({ content: "You are not registered with Allibot. Please register using the /register command." });
        return;
    };
    const sender = allowedSenders[message.author.username];

    let systemMessage = await buildSystemMessage(message, sender);

    let history = "";

    // If history.txt is more than 30 minutes old, log it
    const historyFilePath = path.join(__dirname, "..", 'history.txt');
    if (fs.existsSync(historyFilePath)) {
        const stats = fs.statSync(historyFilePath);
        const fileAge = Date.now() - stats.mtimeMs;

        // Check if the file is older than 30 minutes (1800000 milliseconds)
        if (fileAge > 1800000) {
            // append history.txt to historylog.txt
            historylogger.write(historyFilePath);
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
                content: sender + ": " + message.content
            }
        ],
    });

    history += "\n" + sender + ": " + message.content + "\n";
    history += "Allibot: " + response.output[0].content[0].text;

    // Write the updated history back to the file
    fs.writeFileSync(path.join(__dirname, "..", 'history.txt'), history);

    message.reply({
        content: response.output[0].content[0].text,
        allowedMentions: { users: [message.author.id] }
    });

    logger.info("Replied to " + message.author.username);

    // [DEBUG] write systemMessage to systemMessage.txt
    const systemMessagePath = path.join(__dirname, "..", 'systemMessage.txt');
    fs.writeFileSync(systemMessagePath, systemMessage);
}

const respond = {
    "sendResponse": sendResponse
};

module.exports = respond;
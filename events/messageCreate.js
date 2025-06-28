const { OpenAI } = require('openai');
const { openai_key } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const description = fs.readFileSync(path.join(__dirname, "prompts", 'Allibot-Description'), 'utf8');
const chats = fs.readFileSync(path.join(__dirname, "prompts", 'Allionna-Chats'), 'utf8');

const friends = JSON.parse(fs.readFileSync(path.join(__dirname, 'friends.json'), 'utf8'));

let history = "";

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Check if friends has message.author.username key
        if (!friends[message.author.username]) return;

        const friend = friends[message.author.username];

        if (message.channel.name !== "allibot") return;

        if (!message.content.toLowerCase().includes("allibot")) return;

        const openai = new OpenAI({
            apiKey: openai_key
        });

        let systemMessage = chats + "\n\n" + description;

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

        history += "\n" + friend + ": " + message.content + "\n" + "Allibot: " + response.output[0].content[0].text;
        console.log(history);
        console.log();

        message.reply({
            content: response.output[0].content[0].text,
            allowedMentions: { users: [message.author.id] }
        });
    }
}
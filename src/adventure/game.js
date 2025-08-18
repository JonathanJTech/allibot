const vars = require('./vars.js');
const logger = require('../../logger.js');
const path = require('node:path');
const fs = require('node:fs');
const { OpenAI } = require('openai');
const { openai_key } = require('../../config.json');
const gameData = require("../../allibot-prompts/adventure/game.json");

const openai = new OpenAI({
    apiKey: openai_key
});

const promptsPath = path.join(__dirname, "..", "..", "allibot-prompts", "adventure");

function startGame(){
    setTimeout(() => {
        vars.me.send("30 seconds until the game starts!");
        
        setTimeout(() => {
            let seconds = 1;
            const timer = setInterval(() => {
                vars.me.send("Starting in " + seconds + " seconds...");
                seconds--;
                if (seconds <= 0) {
                    clearInterval(timer);
                    vars.me.send("The game has started!");
                    vars.gaming = true;
                    logger.info("Game started");
                    location = "maya";
                    let msg = fs.readFileSync(path.join(promptsPath, location, "Initial"), 'utf8');
                    vars.channel.send(msg);
                }
            }, 500);
        }, 1000);
    }, 1000);
}

function decide(message, location){
    let systemMessage = fs.readFileSync(path.join(promptsPath, location, "Decider"), 'utf8');
    return openai.responses.create({
        model: "gpt-4.1-mini-2025-04-14",
        input: [
            {
                role: "system",
                content: systemMessage
            },
            {
                role: "user",
                content: message.content
            }
        ],
    }).then(response => {
        return response.output[0].content[0].text.toLowerCase();
    });
}

function gameLoop(message){
    logger.info("Received message from " + message.author.username);

    const location = vars.location;

    decide(message, location).then(decision => {
        // if (decision !== "none"){
        //     const filePath = path.join(promptsPath, location, decision);
        //     let msg = fs.readFileSync(filePath, 'utf8');
        //     vars.channel.send(msg);
        //     if (decision === gameData[location].correct){
        //         console.log("That was correct");
        //     }
        // } else {
            
        // }
    });
}

module.exports = {
    "startGame": startGame,
    "gameLoop": gameLoop
}
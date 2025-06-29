const fs = require ("node:fs");
const path = require ("node:path");
const {env} = require ("./config.json");

const logFilePath = path.join(__dirname, 'log.txt');

function debug(message){
    if (env !== "development") return; // Only log debug messages in development environment
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `[DEBUG] ${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

function info(message){
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `[INFO] ${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

function warn(message){
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `[WARN] ${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

function error(message){
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `[ERROR] ${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

let logger = {
    "debug": debug,
    "info": info,
    "warn": warn,
    "error": error
}

module.exports = logger;
const fs = require ("node:fs");
const path = require ("node:path");

function log(message){
    const logFilePath = path.join(__dirname, 'log.txt');
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

function warn(message){
    const logFilePath = path.join(__dirname, 'warn.txt');
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

function error(message){
    const logFilePath = path.join(__dirname, 'error.txt');
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false});
    const logMessage = `${timestamp}: ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
}

let logger = {
    "log": log,
    "warn": warn,
    "error": error
}

module.exports = logger;
const fs = require('node:fs');
const path = require('node:path');

function write(historyFilePath){
    // append history.txt to historylog.txt
    const historyLogPath = path.join(__dirname, 'historylog.txt');
    const oldHistory = fs.readFileSync(historyFilePath, 'utf8');
    if (fs.existsSync(historyLogPath)) {
        fs.appendFileSync(historyLogPath, "Logging history at " + new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false}) + oldHistory + "\n\n");
    } else {
        fs.writeFileSync(historyLogPath, "Logging history at " + new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' , hour12: false}) + oldHistory + "\n\n");
    }
    fs.unlinkSync(historyFilePath);
    fs.writeFileSync(path.join(__dirname, 'history.txt'), '');
}

let historylogger = {
    "write": write
}

module.exports = historylogger;
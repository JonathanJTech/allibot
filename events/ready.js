const logger = require ('../logger.js');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        logger.log("Allibot online!");
    }
}
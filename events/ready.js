const logger = require ('../logger.js');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        logger.info("Allibot online!");
    }
}
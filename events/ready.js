const logger = require ('../logger.js');
const vars = require('../src/adventure/vars.js');
const { ownerId } = require('../config.json');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        client.users.fetch(ownerId).then(user => {
            vars.me = user;
        });
        logger.info("Allibot online!");
    }
}
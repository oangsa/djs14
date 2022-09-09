const { loadCommands } = require("../../Handlers/commandHandler")
module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        loadCommands(client);
        console.log(`Client is now logged in as ${client.user.username}`);
        client.manager.init(client.user.id);
        client.lavasfy.requestToken();
    }
}
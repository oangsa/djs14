const client = require("../../index");

client.on("raw", (d) => client.manager.updateVoiceState(d));
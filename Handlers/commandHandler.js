// function loadCommands(client){
//     const ascii = require("ascii-table");
//     const fs = require("fs");
//     const table = new ascii().setHeading("Command", "Status");

const { commands } = require('..');

//     let commandsArray = [];
//     let devArray = [];

//     const commandsFolders = fs.readdirSync("./Commands");
//     for (const folder of commandsFolders) {
//         const commandFiles = 
//         fs.readdirSync(`./Commands/${folder}`)
//         .filter((file) => file.endsWith(".js"));

//         for (const file of commandFiles) {
//             const commandFile = require(`../Commands/${folder}/${file}`);

//             // console.log(commandFile.data.name);
//             client.commands.set(commandFile.data.name, commandFile);

//             if(commandFile.developer) devArray.push(commandFile.data.toJSON())
//             else commandsArray.push(commandFile.data.toJSON());

//             table.addRow(file, "✅");
//             continue;
//         }
//     }

//     client.application.commands.set(commandsArray);

//     const devGuild = client.guilds.cache.get(client.config.devguild);

//     devGuild.commands.set(devArray);

//     return console.log(table.toString(), "\nCommands Loaded.")
// }

// module.exports = { loadCommands }

async function loadCommands(client) {
    const { loadFiles } = require('../functions/fileLoader');    
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Commands", "Status");

    await client.commands.clear();

    let commandsArray = [];

    const Files = await loadFiles("Commands");

    Files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);

        commandsArray.push(command.data.toJSON());

        table.addRow(command.data.name, "✅")
    });

    client.application.commands.set(commandsArray);

    return console.log(table.toString(),"\nCommands Loaded") 

}

module.exports = { loadCommands };
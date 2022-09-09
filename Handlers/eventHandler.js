// function loadEvents(client) {
//     const ascii = require("ascii-table");
//     const fs = require("fs");
//     const table = new ascii().setHeading("Events", "Status");

const { file } = require('../Commands/Dev/ytdl(dev)');

//     const folders = fs.readdirSync("./Events");
//     for (const folder of folders) {
//         const files = fs
//         .readdirSync(`./Events/${folder}`)
//         .filter((file) => file.endsWith(".js"));
//         for (const file of files) {
//             const event = require(`../Events/${folder}/${file}`)

//             if(event.rest) {
//                 if (event.once)
//                 client.rest.once(event.name, (...args) => event.execute(...args, client));
//                 else
//                 client.rest.on(event.name, (...args) => event.execute(...args, client));
//             } else {
//                 if (event.once)
//                 client.once(event.name, (...args) => event.execute(...args, client));
//                 else
//                 client.on(event.name, (...args) => event.execute(...args, client));
//             }
//             table.addRow(file, "✅");
//             continue;
//         }
//     }
//     return console.log(table.toString(), "\nEvents Loaded.")
// }

// module.exports = { loadEvents };

async function loadEvents(client){
    const { loadFiles } = require('../functions/fileLoader');    
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Events", "Status");

    await client.events.clear();

    const Files = await loadFiles("Events");

    Files.forEach((file) => {
        const event = require(file)
        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if(event.rest){
            if(event.once) client.rest.on(event.name, execute);
            else
            client.rest.on(event.name, execute);
        }else{
            if(event.once) client.once(event.name, execute);
            else
            client.on(event.name, execute);
        }

        table.addRow(event.name, "✅" )
    })

    return console.log(table.toString(), "\nLoaded Events")

}

module.exports = { loadEvents }
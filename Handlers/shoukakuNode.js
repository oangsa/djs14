async function loadShoukakuNodes(client) {
  const { magenta, green } = require("chalk");
  const { fileLoad } = require("../utils/fileLoader");

  const files = await fileLoad("../Events/shoukaku/node");
  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    client.manager.shoukaku.on(event.name, execute);

    return console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("]") +
        " Loaded " +
        green(`${event.name}.js`)
    );
  });
}

module.exports = { loadShoukakuNodes };
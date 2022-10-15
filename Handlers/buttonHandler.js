async function loadButtons(client) {
  const { magenta, green } = require("chalk");
  const { loadFiles } = require("../functions/fileLoader");

  const files = await loadFiles("buttons");
  files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;

    client.buttons.set(button.id, button);

    return console.log(
      magenta("[") +
        magenta("Buttons") +
        magenta("]") +
        " Loaded" +
        green(` ${button.id}.js`)
    );
  });
}

module.exports = { loadButtons };
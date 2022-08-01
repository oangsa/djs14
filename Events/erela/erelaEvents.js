const client = require("../../index");
const { EmbedBuilder } = require("discord.js");
const pms = require("pretty-ms");
const { magenta, white, red, green } = require("chalk");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  name: "erelaEvents",
  run: client.manager
    .on("nodeConnect", (node) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          green(" Node ") +
          white(node.options.identifier) +
          green(" connected!")
      );
    })

    .on("nodeDisconnect", (node) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          white(` Lost connection to node `) +
          red(`${node.options.identifier}`)
      );
    })

    .on("nodeError", (node, error) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          red(" An error has occured regarding node ") +
          white(node.options.identifier) +
          red(`: ${error.message}`)
      );
    })

    .on("trackStart", (player, track) => {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("⏯️ | Play/Pause")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("⏭️ | Skip")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("repeat")
        .setLabel("🔁 | Repeat")
        .setStyle(ButtonStyle.Primary)
      );
      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("repeat2")
        .setLabel("🔁 | Stop Repeat")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("⏹️ | Stop")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId("lyrics")
        .setLabel("📃 | Lyrics")
        .setStyle(ButtonStyle.Secondary)
      )
      client.channels.cache.get(player.textChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor("#008000")
            .setDescription(
              `🎶 | Now Playing: **[${track.title}](${track.uri})** [<@${
                track.requester.id
              }> - ${pms(track.duration)}]\nvolume: \`${player.volume}%\``
            )
            .setTimestamp(),
        ],
        components: [row1, row2]
      });
    })

    .on("queueEnd", player => {
      const channel = client.channels.cache.get(player.textChannel);
      channel.send({
        embeds: [
          new EmbedBuilder()
          .setColor("#008000")
          .setDescription("🔹| Queue/ Song Ended.")
        ]
      });
      player.destroy();
    })
};

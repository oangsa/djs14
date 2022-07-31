const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {CommandInteraction} interaction
     */
    execute(interaction) {
        interaction.reply({content: "test", ephemeral: true})
    }
}
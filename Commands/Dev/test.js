const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    test: true,
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        interaction.reply({content: "test", ephemeral: true})
    }
}
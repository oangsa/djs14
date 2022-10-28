const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the ping")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * 
     */
    execute(interaction, client) {
        interaction.reply({content: `${client.ws.ping}`, ephemeral: true})
    }
}
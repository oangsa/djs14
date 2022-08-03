const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the ping")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {CommandInteraction} interaction
     * 
     */
    execute(interaction, client) {
        interaction.reply({content: `${client.ws.ping}`, ephemeral: true})
    }
}
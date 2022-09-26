const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("test")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const button = new ButtonBuilder()
        .setCustomId("test")
        .setLabel("Click Me!")
        .setStyle(ButtonStyle.Primary);
        interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)]
        });
    }
}
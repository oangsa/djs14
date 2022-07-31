const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);

        if(!Button) return;

        if(Button.permission && !interaction.member.permissions.has(Button.permission))
        return interaction.reply({embeds: [new MessageEmbed().setDescription(`You don't have the permission to use this button.`).setColor("RED")], ephemeral: true});
        
        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
        return interaction.reply({embeds: [new MessageEmbed().setDescription(`You aren't owner!`).setColor("RED")], ephemeral: true});

        Button.execute(interaction, client);
    }
}
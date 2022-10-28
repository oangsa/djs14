const { ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        
        if(!command)
        return interaction.reply({content: "⛔ This command is outdated or not exist.", ephemeral: true});

        if(command.developer && interaction.user.id !== "372215298788687875")
        return interaction.reply({content: "❤️ This command is only available to developer.", ephemeral: true});

        if(command.test && interaction.user.id !== "372215298788687875")
        return interaction.reply({content: "🔥 This command currently in development state.", ephemeral: true});

        command.execute(interaction,client);
    }
}
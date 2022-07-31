const { CommandInteraction } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        
        if(!command) {
            return interaction.reply({content: "This command is outdated or not exist.", ephemeral: true})
        }

        command.execute(interaction,client);
    }
}
module.exports = {
    data: {
        name: "test"
    },
    execute(interaction, client){
        interaction.reply({
            content: "TEST", ephemeral: true
        });
    }
}
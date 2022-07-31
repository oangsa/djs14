const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "stop"
    },
    execute(interaction, client){
        const { member } = interaction;
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true,
        });
        if (player.playing) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("BLURPLE")
            .setDescription("🔹| There is nothing in the queue.")
        ],
        ephemeral: true});
        player.destroy();
        const pauseEmbed = new EmbedBuilder()
        .setColor("BLURPLE")
        .setDescription("🔹| Stoped.");
        return interaction.reply({
            embeds: [pauseEmbed],
            ephemeral: true
        });
    }
}
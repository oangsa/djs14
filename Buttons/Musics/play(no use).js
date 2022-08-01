const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "play"
    },
    execute(interaction, client){
        const { member } = interaction;
        const VoiceChannel = member.voice.channel;
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true,
        });
        if (player.playing) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🔹| There is nothing in the queue or the song is already played.")
        ],
        ephemeral: true});
        player.pause(false);
        const pauseEmbed = new EmbedBuilder()
        .setColor("#008000")
        .setDescription("🔹| Resume.");
        return interaction.reply({
            embeds: [pauseEmbed],
            ephemeral: true
        });
    }
}
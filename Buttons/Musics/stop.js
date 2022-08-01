const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "stop"
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
        if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
            new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
        ],
        ephemeral: true});
        if (!player.playing) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🔸| There is nothing in the queue.")
        ],
        ephemeral: true});
        player.destroy();
        const pauseEmbed = new EmbedBuilder()
        .setColor("#008000")
        .setDescription("⏹️ | Stoped.");
        return interaction.reply({
            embeds: [pauseEmbed],
            ephemeral: true
        });
    }
}
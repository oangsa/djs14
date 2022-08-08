const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "repeat2"
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
        if (!VoiceChannel || !player.playing && !player.queue.current) return interaction.reply({ embeds: [
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
        if (!player.trackRepeat && !player.queueRepeat) {
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription("🔸| Repeat mode has already disabled.")
            ],
            ephemeral: true});
        } else {
            player.setTrackRepeat(false);
            player.setQueueRepeat(false);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("#FFFDD0")
                .setDescription("✅ | Repeat mode disabled.")
            ],
            ephemeral: true});
        }
    } 
}
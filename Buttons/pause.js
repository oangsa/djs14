const { EmbedBuilder } = require("discord.js")
module.exports = {
    id: "pause",
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
            .setDescription("⛔ | There is nothing in the queue or you don't joined the voice channel yet.")
        ],
        ephemeral: true});
        if (player.playing) {
            player.pause(true);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("#FFFDD0")
                .setDescription("⏸️ | Paused.")
            ],
            ephemeral: true});
        } else {
            player.pause(false);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("#FFFDD0")
                .setDescription("▶️ | Resumed.")
            ],
            ephemeral: true});
        }
    }
}
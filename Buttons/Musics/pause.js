const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "pause"
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
        if (!VoiceChannel) return interaction.reply({ embeds: [
            new EmbedBuilder()
            .setColor("BLURPLE")
            .setDescription("🔹| There is nothing in the queue.")
        ],
        ephemeral: true});
        if (player.playing) {
            player.pause(true);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Paused.")
            ],
            ephemeral: true});
        } else {
            player.pause(false);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Played.")
            ],
            ephemeral: true});
        }
    }
}
const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "repeat2"
    },
    execute(interaction, client){
        const { member } = interaction;
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true,
        });
        if (!player.playing) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("BLURPLE")
            .setDescription("🔹| There is nothing in the queue.")
        ],
        ephemeral: true});
        if (!player.trackRepeat && !player.queueRepeat) {
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Repeat mode has already disabled.")
            ],
            ephemeral: true});
        } else {
            player.setTrackRepeat(false);
            player.setQueueRepeat(false);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Repeat mode disabled.")
            ],
            ephemeral: true});
        }
    } 
}
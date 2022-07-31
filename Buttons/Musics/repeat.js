const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: {
        name: "repeat"
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
            player.setTrackRepeat(true)
            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Repeat mode has been enabled. (Song)")
            ],
            ephemeral: true});
        } else if (player.trackRepeat && !player.queueRepeat) {
            player.setTrackRepeat(true);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Repeat mode has been enabled. (Song)")
            ],
            ephemeral: true});
        } else {
            player.setQueueRepeat(true);
            return interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹| Repeat mode has been enabled. (Queue)")
            ],
            ephemeral: true});
        }
    } 
}
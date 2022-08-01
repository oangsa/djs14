const { EmbedBuilder } = require("discord.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
module.exports = {
    data: {
        name: "lyrics"
    },
    async execute(interaction, client){
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
        const track = player.queue.current;
        const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", "");
        const actualTrack = await gClient.songs.search(trackTitle);
        const searches = actualTrack[0];
        const lyrics = await searches.lyrics();
        // await interaction.deferReply();
        const lyricsEmbed = new EmbedBuilder()
        .setColor("#E6E3D3")
        .setTitle(`📃 | Lyrics for **${trackTitle}**`)
        .setDescription(lyrics)
        .setFooter({text: "Provided by Genius"})
        .setTimestamp();
        return interaction.reply({
            embeds: [lyricsEmbed]
        });
    }
}
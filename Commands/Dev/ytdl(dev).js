const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, createReactionCollector, ComponentType } = require("discord.js");
const fs = require("fs")
const ytdl = require("ytdl-core")
const ytsr = require("ytsr")
const fileName = randomName(6)
const {stripIndents} = require('common-tags')
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("yt-downloader-mp3(dev)")
    .setDescription("yt-downloader-mp3(dev ver.)")
    .addStringOption(option =>
        option.setName('query')
        .setDescription('provide a video url')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    file : fileName,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        interaction.deferReply({});
        const query = interaction.options.getString("query");
        ytsr(query).then(async i => {
            try {
                const music = i.items[0]
                const url = "http://www.youtube.com/watch?v=" + music.id
                const song = await ytdl(url, { quality: 'highestaudio', format: "mp3", filter: "audioonly"}).pipe(fs.createWriteStream("musicFolder/"+ fileName + ".mp3"))
                const wait = await interaction.editReply(`Searching music \`${query}\` please wait...`)
                const musicEmbed = new EmbedBuilder()
                .setColor("#FFFDD0")
                .setTitle(music.title)
                .setDescription(stripIndents`Name:  \`${music.title}\`
                Duration:  \`${music.duration}\`
                
                Please select button
                `)
                const row1 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("yes(dev)")
                    .setLabel("Download")
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId("no(dev)")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger),
                  );
                await interaction.editReply({ embeds: [musicEmbed], components: [row1] });
            } catch(err) {
                console.log(err)
            }
        })
    }
}
           
function randomName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "KGY" + result;
}

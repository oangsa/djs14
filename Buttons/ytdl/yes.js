// const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
// const fs = require("fs")
// const fileName = myModule.file;
// const {stripIndents} = require('common-tags')
// module.exports = {
//     data: {
//         name: "yes"
//     },
//     async execute(interaction, client){
//         const channel = interaction.message.channel;
//         channel.messages.fetch({ limit: 1 }).then(messages => { messages.first().delete(); });
//         const downloadWait = new EmbedBuilder()
//         .setColor("#FFFF00")
//         .setDescription('Downloading... (10%)')
//         const downloadWait2 = new EmbedBuilder()
//         .setColor("#FFFF00")
//         .setDescription('Downloading... (45%)')
//         const downloadWait3 = new EmbedBuilder()
//         .setColor("#FFFF00")
//         .setDescription('Downloading... (75%)')
//         const downloadWait4 = new EmbedBuilder()
//         .setColor("#FFFF00")
//         .setDescription('Downloading... (100%)')
//         const downloadSuccess = new EmbedBuilder()
//         .setColor("#FFFDD0")
//         .setDescription('Download success!')
//         const unknownError = new EmbedBuilder()
//         .setColor("#FF0000")
//         .setDescription(stripIndents`Unknown error! 
//         Error: Large size music cannot be sent`)
//         const waiting = await channel.send({ embeds:[downloadWait] })
//         setTimeout(async function() {
//             waiting.edit({ embeds:[downloadWait2] })
//         }, 3000)
//         setTimeout(async function() {
//             waiting.edit({ embeds:[downloadWait3] })
//         }, 5000)
//         setTimeout(async function() {
//             waiting.edit({ embeds:[downloadWait4] }).then(m => m.delete({timeout: 15000}))
//         }, 8000)
//         setTimeout(async function() {
//             const tes = fs.readFileSync(`musicFolder/${fileName}.mp3`)
//             const file = new AttachmentBuilder(tes, { name : `music.mp3` })
//             channel.send({ files: [file] })}, 12000
//         )
//     }
// }
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs")
const myModule = require('../../Commands/Public/ytdl.js');
const fileName = myModule.file;
const {stripIndents} = require('common-tags')
module.exports = {
    data: {
        name: "yes"
    },
    async execute(interaction){
        const channel = interaction.message.channel;
        channel.messages.fetch({ limit: 1 }).then(messages => { messages.first().delete(); });
        // await interaction.deferReply({});
        const downloadWait = new EmbedBuilder()
        .setColor("#FFFF00")
        .setDescription('Downloading... (10%)')
        const downloadWait2 = new EmbedBuilder()
        .setColor("#FFFF00")
        .setDescription('Downloading... (45%)')
        const downloadWait3 = new EmbedBuilder()
        .setColor("#FFFF00")
        .setDescription('Downloading... (75%)')
        const downloadWait4 = new EmbedBuilder()
        .setColor("#FFFF00")
        .setDescription('Downloading... (100%)')
        const unknownError = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription(stripIndents`Unknown error! 
        Error: Large size music cannot be sent`)
        const waiting = await channel.send({ embeds:[downloadWait] })
        setTimeout(async function() {
            waiting.edit({ embeds:[downloadWait2] })
        }, 3000)
        setTimeout(async function() {
            waiting.edit({ embeds:[downloadWait3] })
        }, 5000)
        setTimeout(async function() {
            waiting.edit({ embeds:[downloadWait4] }).then(m => m.delete({timeout: 15000}))
        }, 8000)
        setTimeout(async function() {
            const tes = fs.readFileSync(`musicFolder/${fileName}.mp3`)
            const file = new AttachmentBuilder(tes, { name : `music.mp3` })
            channel.send({ files: [file] })}, 12000
        )
    }
}
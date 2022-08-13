const { EmbedBuilder } = require("discord.js");
const fs = require("fs")
const myModule = require('../../Commands/Dev/ytdl(dev).js');
const fileName = myModule.file;
module.exports = {
    data: {
        name: "no(dev)"
    },
    async execute(interaction, client){
        const channel = interaction.message.channel;
        channel.messages.fetch({ limit: 1 }).then(messages => { messages.first().delete(); });
        fs.unlinkSync(`musicFolder/${fileName}.mp3`)
        interaction.reply({
            embeds: [new EmbedBuilder().setColor("#E74C3C").setDescription(`❌ | Canceled!`)],
            ephemeral: true
        })
    }
}
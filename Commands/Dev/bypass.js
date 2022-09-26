const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const axios = require("axios")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("bypass")
    .setDescription("bypass ads link. (dev ver.)")
    .addStringOption(option =>
	option.setName('link')
	.setDescription('input your ads links')
	.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const ads = interaction.options.getString("link");
        axios({
            method: 'post',
            url: 'https://api.bypass.vip/',
            data: new URLSearchParams({
                url: ads
            })
        }).then(res => {
            const data = res.data
            if (data.success == true) {
                const embed = new EmbedBuilder()
                    .setColor("#008000")
                    .setDescription("Sandwich | Bypass Manager")
                    .setThumbnail("https://images-ext-1.discordapp.net/external/ncx2BvLRVNaN8ov83Bt2t56U_BaovgzxdITJmijRtDs/https/thumbs.gfycat.com/PlainHonestAzurevase-size_restricted.gif")
                    .setFields({
                        name: `Bypassed (${data.website})`,
                        value: `${data.destination}`
                    })
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        }).catch(err => {
            interaction.reply({
              content: `⚠️ Error: ${err.response.data.response} ⚠️`,
              ephemeral: true
            });
          })
    }
}
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { note } = require("../../mongoSchemas/notes")

module.exports = {
    developer: false, // set dev mode for
    data: new SlashCommandBuilder()
    .setName("leave_check")
    .setDescription("leave_check")
    .addStringOption(option =>
	option.setName('number')
	.setDescription('input your class number')
	.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const num = interaction.options.getString("number");
        const errEmbed = new EmbedBuilder()
        .setDescription("⛔ | Your class number is invalid or you are not leave yet.")
        .setColor("#FF0000")
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        note.findOne({"class_num":num}, function(err, res) {
            if(!res){
                interaction.reply({embeds: [errEmbed], ephemeral: true})
            } else {
                dates = res["nweekDate"]
                const datemap = dates.map(x => {
                    const d = new Date(x).toLocaleDateString('TH-th', options)
                    return ` ⤷ ${d}`
                }).join(" \n")
                const embed = new EmbedBuilder()
                .setTitle(res["name"])
                .setDescription(`\`\`\`ini\nTotals\n ⤷ ${res["total_days"]} days\nWeek Dates\n ⤷ ${res["week_days"]} days\nDates\n${datemap}\`\`\``)
                .setColor("#57F287")
                
                interaction.reply({embeds: [embed], ephemeral: true})
            }
        })
    }
}
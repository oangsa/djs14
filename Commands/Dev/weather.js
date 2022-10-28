const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, } = require("discord.js");
const weather = require('weather-js');

module.exports = {
    test: true,
    data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("weather forecast (dev ver.)")
    .addStringOption(option =>
	option.setName('location')
	.setDescription('usage: *province(จังหวัด)*,*country(ประเทศ)*')
	.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const locate = interaction.options.getString("location");
        weather.find({search: locate, degreeType: "C"}, function(error, result){
            const errEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("**⛔ You didn't specify a valid location**")

            if (result === undefined || result.length === 0) return interaction.reply({embeds: [errEmbed]});
            if (error) console.log(error);
            const current = result[0].current
            const location = result[0].location
            
            const embed = new EmbedBuilder()
                .setTitle(`Showing the Weather Info for ${current.observationpoint}`)
                .setDescription(current.skytext)
                .setThumbnail(current.imageUrl)
                .setColor("#00ff00")
                .setTimestamp()
                .addFields({name: "Temperature: ", value: current.temperature + "°C", inline: true})
                .addFields({name:"Wind Speed: ", value:current.winddisplay, inline: true})
                .addFields({name:"Humidity: ", value:`${current.humidity}%`, inline: true})
                .addFields({name:"Timezone: ", value:`UTC${location.timezone}`, inline: true})
    
            interaction.reply({embeds: [embed]})
        })
    }
}
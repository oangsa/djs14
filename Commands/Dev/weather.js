const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, Embed } = require("discord.js");
const weather = require('weather-js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("weather forecast (dev ver.)")
    .addStringOption(option =>
	option.setName('location')
	.setDescription('usage: *province(จังหวัด)*,*country(ประเทศ)*')
	.setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {CommandInteraction} interaction
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
          .addField("Temperature: ", current.temperature + "°C", true)
          .addField("Wind Speed: ", current.winddisplay, true)
          .addField("Humidity: ", `${current.humidity}%`, true)
          .addField("Timezone: ", `UTC${location.timezone}`, true)
    
          interaction.reply({embeds: [embed]})
        })
    }
}
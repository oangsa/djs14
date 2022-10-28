const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Levels = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("rank of user."),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        // interaction.deferReply({});
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        const userId = interactionUser.id;
        const user = await Levels.fetch(userId, interaction.guild.id, true);
        if (!user) {
            return await interaction.reply({embeds: [new EmbedBuilder().setColor("#FF0000").setDescription(`🤍 |You don't have any racist xp.`)], ephemeral: true });
    } else {
            var neededXP = Levels.xpFor(parseInt(user.level) + 1);
            const rank = new canvacord.Rank()
            .setAvatar(interactionUser.user.displayAvatarURL({ dynamic: false, format: "png" }))
            .setCurrentXP(user.xp)
            .setLevel(user.level || 0)
            .setRequiredXP(neededXP)
            .setRank(user.position)
            .setProgressBar('BLACK', 'COLOR')
            .setUsername(interactionUser.user.username)
            .setDiscriminator(interactionUser.user.discriminator);
            rank.build().then(async data => {
            const attachment = new AttachmentBuilder(data, { name: 'rankcard.png' });;
            await interaction.reply({
                files: [attachment],
            });
        })
        } 
    }
}
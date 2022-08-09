const { Message, EmbedBuilder, WebhookClient } = require("discord.js");
const client = require('../../index.js');
const Levels = require("discord-xp");
const DatabaseURL = client.config.database;
Levels.setURL(DatabaseURL);
const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1006232670608560258/y3VnbixsbHbf_bSErxucyyALbFJGh9Fx1D8L_Uu7Tt9v5H_790yOguO-35ODwAwlAf5d"
});
module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message
     */
    async execute(message) {
        //main part
        if (message.author.bot) return;
        if (!message.guild) return;
        const content = message.content.toLowerCase();
        const check = ["nigger", "niger", "niga", "nigga", "node", "nodes", "niggers", "nigaboo", "niggerish", "ดำ", "nig", "nigg", "niega", "niegar", "nieger", "nikker", "nieker", "niker"]
        var pass = true
        for (var i = 0, ln = check.length; i < ln; i++) {
            if (content.indexOf(check[i]) !== -1) {
              pass = false;
              break;
            }
        }
        if (pass == false) {
            const randomXP = Math.floor(Math.random() * 10) + 1;
            const hasLevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXP);
            const user = await Levels.fetch(message.author.id, message.guild.id);
            if (hasLevelUp){
                await message.channel.send({
                    contents: `<@${message.author.id}>`,
                    embeds: [new EmbedBuilder().setDescription(`🖤 |\`${message.author.username}\` your racist has leveled up to \`${user.level}\`!`).setColor("#23272A")]
                    });
                }
            //logger
                const embeds = new EmbedBuilder()
                .setColor("#5865F2")
                .setDescription(`**• User**: ${message.author.username}\n**• Guild**: ${message.guild.name}\n**• EXP Gain**: ${randomXP}\n**• Total Exp**: ${user.xp}`)
                // .addFields([{ name: "User", value: `• ${message.author.username}` }])
                // .addFields([{ name: "Guild", value: `• ${message.guild.name}` }])
                // .addFields([{ name: "EXP Gain", value: `• ${randomXP}` }])
                // .addFields([{ name: "Total Exp", value: `• ${user.xp}` }])
                // .addFields([{ name: "Current Level", value: `• ${user.level}` }]);
                return webhook.send({embeds: [embeds]});
        } else {
                return;
        }
    }
}
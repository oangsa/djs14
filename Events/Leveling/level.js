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
        const check = ["nigger", "niger", "niga", "nigga", "node", "nodes", "nigger", "nigaboo", "niggerish", "ดำ"]
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
            if (hasLevelUp){
            const user = await Levels.fetch(message.author.id, message.guild.id);
            await message.channel.send({
                contents: `<@${message.author.id}>`,
                embeds: [new EmbedBuilder().setDescription(`🖤 | ${message.author.username} your racist has leveled up to ${user.level}!`).setColor("BLACK")]
                });
            }
            //logger
            return webhook.send(`<${message.author.username}> gain ${randomXP} racist exp. | Guild: <${message.guild.name}>`)
        } else {
            return;
        }
        
    }
}
function AntiCrash(client){
    const { EmbedBuilder, WebhookClient } = require("discord.js");
    const { inspect } = require("util");
    const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1004335689724338307/2wuI2B2ARlHULvveZ-qF0GQcE0ANbcF48rHyqanYWxAIn6PIwpcrpchXgmovSZz_9pSc"
    });
    const embed = new EmbedBuilder();
    client.on("error", (err) => {
        console.log(err);

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setColor("#2F3136")
            .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.log(reason, "\n", promise);

        embed
            .setTitle("**Unhandled Rejection/Catch**")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .setColor("Red")
            .addFields(
                { name: "Reason", value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Promise", value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtException", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("**Uncaught Exception/Catch**")
            .setColor("Red")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("**Uncaught Exception Monitor**")
            .setColor("Red")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();
    
        return webhook.send({ embeds: [embed] });
    });
    
    process.on("warning", (warn) => {
        console.log(warn);

        embed
            .setTitle("**Uncaught Exception Monitor Warning**")
            .setColor("Red")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields(
                { name: "Warning", value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
}





module.exports = { AntiCrash };
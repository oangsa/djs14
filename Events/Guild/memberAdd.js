const { EmbedBuilder } = require('discord.js');
const Schema = require('../../mongoSchemas/welcomeSchemas');
  
module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
    Schema.findOne({ Guild: member.guild.id}, async (err, data) => {
        if (!data) return;
        const channel = data.Channel;
        const Msg = data.Msg || " ";
        const Image = data.Image;
        const welcomeCH = member.guild.channels.cache.get(channel);
        const newMsg = new EmbedBuilder()
        .setAuthor({
            name: 'Hello~ ' + member.displayName + '!',
            iconURL: member.displayAvatarURL({
            dynamic: true
          })
        })
        .setTitle(`Welcome To ${member.guild.name}`)
        .setDescription(Msg)
        .setColor('#5FD7FF')
        .setTimestamp();
        if (!Image) {
            welcomeCH.send({
                content: `${member.user} Joined The Server!`,
                embeds: [newMsg],
            })
        } else {
            newMsg.setImage(Image)
            welcomeCH.send({
                content: `${member.user} Joined The Server!`,
                embeds: [newMsg],
            })
        };
        if (err) {
            console.log(err)
        };
    });
    }
}
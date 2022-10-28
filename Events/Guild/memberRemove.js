const { GuildMember, EmbedBuilder, AttachmentBuilder,} = require('discord.js');
const Schema = require('../../mongoSchemas/leaveSchemas');
  
module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
    Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
        if (!data) return;
        const channel = data.Channel;
        const Msg = data.Msg || " ";
        const Image = data.Image;
        const leaveCH = member.guild.channels.cache.get(channel); 
        const newMsg = new EmbedBuilder()
        .setAuthor({
            name: member.displayName + ' is Leaving the server!',
            iconURL: member.displayAvatarURL({
            dynamic: true
          })
        })
        .setTitle(`${member.displayName} is leaving ${member.guild.name}`)
        .setDescription(Msg)
        .setColor('#5FD7FF')
        .setTimestamp();
        if (!Image) {
            leaveCH.send({
                content: `${member.user} Leave The Server!`,
                embeds: [newMsg],
            })
        } else {
            newMsg.setImage(Image)
            leaveCH.send({
                content: `${member.user} Leave The Server!`,
                embeds: [newMsg],
            })
        };
        if (err) {
            console.log(err);
        }
    });
}
}
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const { loadButtons } = require("./Handlers/buttonHandler")

const Deezer = require("erela.js-deezer");
const Apple = require("erela.js-apple");
const { Manager } = require("erela.js");
const { LavasfyClient } = require("lavasfy");


const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember]
});

client.buttons = new Collection()
client.commands = new Collection();
client.config = require("./config.json");

client.lavasfy = new LavasfyClient(
    {
      clientID: client.config.spotifyClientID,
      clientSecret: client.config.spotifySecret,
      filterAudioOnlyResult: true,
      autoResolve: true,
      useSpotifyMetadata: true,
      playlistPageLoadLimit: 1,
    },
    client.config.nodes
  );
  
client.manager = new Manager({
    nodes: client.config.nodes,
    plugins: [new Apple(), new Deezer()],
    send: (id, payload) => {
      let guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });

client.login(client.config.TOKEN).then(() => {
  client.removeAllListeners();
  loadEvents(client);
  loadCommands(client);
  loadButtons(client);
}).catch((err) => console.log(err))

module.exports = client;
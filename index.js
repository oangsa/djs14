//DJS
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials
const client = new Client({ 
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember]
});

//ERELA
const Deezer = require("erela.js-deezer");
const Apple = require("erela.js-apple");
const { Manager } = require("erela.js");
const { LavasfyClient } = require("lavasfy");

//HANDLERS
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
const { AntiCrash } = require("./Handlers/anticrashHandler");

client.buttons = new Collection()
client.commands = new Collection();
client.config = require("./config.json");

//Database
const mongoose = require("mongoose");
const Database = client.config.database;


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
  AntiCrash(client);
  if (!Database) {
    return console.log(`${client.user.username} isn't connect to database.`); 
  }
  mongoose.connect(Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log(`${client.user.username} is now connected to database.`);
  })
}).catch((err) => console.log(err))

module.exports = client;
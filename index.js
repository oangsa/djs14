//DJS
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials
const client = new Client({ 
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember]
});

//SHOUKAKU
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const Spotify = require("kazagumo-spotify");


//HANDLERS
const { loadEvents } = require("./Handlers/eventHandler");
const { AntiCrash } = require("./Handlers/anticrashHandler");
const { loadShoukakuNodes } = require("./Handlers/shoukakuNode");
const { loadShoukakuPlayer } = require("./Handlers/shoukakuPlayer");

client.events = new Collection();
client.buttons = new Collection();
client.commands = new Collection();
client.config = require("./config.json");
require('dotenv').config()

//call Functions
loadEvents(client);
loadShoukakuNodes(client);
loadShoukakuPlayer(client);


//Database
const mongoose = require("mongoose");
const Database = process.env.database;

const kazagumoClient = new Kazagumo({
  plugins: [
    new Spotify({
      clientId: process.env.spotifyClientID,
      clientSecret: process.env.spotifySecret,
    }),
  ],
  defaultSearchEngine: "youtube",
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
},
new Connectors.DiscordJS(client),
client.config.nodes, {
  moveOnDisconnect: false,
  resume: true,
  reconnectTries: 5,
  restTimeout: 10000,
});

client.login(process.env.TOKEN).then(() => {
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
client.manager = kazagumoClient;

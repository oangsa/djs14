const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client,} = require("discord.js");
const util = require("../../utils/util.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { TrackUtils } = require("erela.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("A complete music system.")
        .addSubcommand((options) =>
            options
                .setName("play")
                .setDescription("Play a song.")
                .addStringOption((option) =>
                    option
                        .setName("query")
                        .setDescription("Provide the name of the song or URL.")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName("volume")
                .setDescription("Alter the volume.")
                .addNumberOption((option) =>
                    option
                        .setName("percent")
                        .setDescription("Provide the volume.")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName("repeat")
                .setDescription("Repeat the current song or queue.")
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Select the loop type.")
                        .setRequired(true)
                        .addChoices({
                            name: "🔹 | None",
                            value: "none"
                        }, {
                            name: "🔹 | Queue",
                            value: "queue"
                        }, {
                            name: "🔹 | Song",
                            value: "song"
                        })
                )
        )
        .addSubcommand((options) =>
            options
                .setName("settings")
                .setDescription("Select an option.")
                .addStringOption((option) =>
                    option
                        .setName("options")
                        .setDescription("Select an option.")
                        .setRequired(true)
                        .addChoices({
                            name: "🔹 | View Queue",
                            value: "queue"
                        }, {
                            name: "🔹 | Skip",
                            value: "skip"
                        }, {
                            name: "🔹 | Pause",
                            value: "pause"
                        }, {
                            name: "🔹 | Resume",
                            value: "resume"
                        }, {
                            name: "🔹 | Stop",
                            value: "stop"
                        }, {
                            name: "🔹 | Lyrics",
                            value: "lyrics"
                        }, {
                            name: "🔹 | Shuffle",
                            value: "shuffle"
                        }, {
                            name: "🔹 | Now Playing",
                            value: "nowplaying"
                        })
                )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {
            options,
            member,
            guild
        } = interaction;
        const VoiceChannel = member.voice.channel;

        const noVC = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
                "🔸| You need to be in a voice channel to use this command."
            );

        const alreadyPlaying = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
                `🔸| Sorry but I'm already playing music in <#${guild.members.me.voice.channelId}>.`
            );
        if (!VoiceChannel) return interaction.reply({ embeds: [noVC], ephemeral: true});
        if (
            guild.members.me.voice.channelId &&
            VoiceChannel.id !== guild.members.me.voice.channelId
        )
            return interaction.reply({
                embeds: [alreadyPlaying],
            });

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true,
            volume: 50,
        });

        let res;
        try {
            switch (options.getSubcommand()) {
                case "play": {
                    const query = interaction.options.getString("query");
        
                    if (player.state !== "CONNECTED") player.connect();
        
                    try {
                      if (query.match(client.lavasfy.spotifyPattern)) {
                        const node = client.lavasfy.nodes.get("main");
                        res = await node.load(query);
        
                        if (res.loadType === "LOAD_FAILED") {
                          if (!player.queue.current) player.destroy();
        
                          return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| An error has occured while trying to add this song.")
                                ],
                                ephemeral: true
                            });     
                        }
        
                        if (res.loadType === "NO_MATCHES") {
                          if (!player.queue.current) player.destroy();
        
                          return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| No result found.")
                                ],
                                ephemeral: true
                          });
                        }
        
                        if (res.loadType === "PLAYLIST_LOADED") {
                          await interaction.deferReply();
        
                          const tracks = [];
                          for (const track of res.tracks) {
                            const trackData = TrackUtils.build(track, interaction.user);
                            tracks.push(trackData);
                          }
                          player.queue.add(tracks);
        
                          await player.play();
        
                          const playlistEmbed = new EmbedBuilder()
                            .setColor("#008000")
                            .setDescription(
                              `🎶 | **[A playlist](${query})** has been added to the queue.`
                            )
                            .addFields([
                              {
                                name: "Enqueued",
                                value: `\`${res.tracks.length}\` tracks`,
                              },
                            ]);
                          await interaction.editReply({ embeds: [playlistEmbed] });
                        }
        
                        if (
                          res.loadType === "TRACK_LOADED" ||
                          res.loadType === "SEARCH_RESULT"
                        ) {
                          await interaction.deferReply();
        
                          player.queue.add(
                            TrackUtils.build(res.tracks[0], interaction.user)
                          );
        
                          await player.play();
        
                          const enqueueEmbed = new EmbedBuilder()
                            .setColor("#008000")
                            .setDescription(
                              `🎶 | Enqueued **[${res.tracks[0].info.title}](${res.tracks[0].info.uri})** [${member}]`
                            )
                            .setTimestamp();
                          interaction.editReply({ embeds: [enqueueEmbed] });
        
                          if (player.queue.totalSize > 1)
                            enqueueEmbed.addFields([
                              {
                                name: "Position in queue",
                                value: `${player.queue.size - 0}`,
                              },
                            ]);
                          return interaction.editReply({ embeds: [enqueueEmbed] });
                        }
                      } else {
                        res = await player.search(query, interaction.user);
        
                        if (res.loadType === "LOAD_FAILED") {
                          if (!player.queue.current) player.destroy();
                          return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| An error has occured while trying to add this song.")
                                ],
                                ephemeral: true
                            });
                        }
        
                        if (res.loadType === "NO_MATCHES") {
                          if (!player.queue.current) player.destroy();
                          return interaction.reply({
                           embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| No result found.")
                                ],
                                ephemeral: true
                            });
                        }
        
                        if (res.loadType === "PLAYLIST_LOADED") {
                          await interaction.deferReply();
        
                          player.queue.add(res.tracks[0]);
                          if (!player.playing && !player.paused && !player.queue.size) 
                          await player.play()
        
                          const playlistEmbed = new EmbedBuilder()
                            .setColor("#008000")
                            .setDescription(
                              `🎶 | **[${res.playlist.name}](${query})** has been added to the queue.`
                            )
                            .addFields([
                              {
                                name: "Enqueued",
                                value: `\`${res.tracks.length}\` tracks`,
                              },
                            ]);
                          return interaction.editReply({ embeds: [playlistEmbed] });
                        }
        
                        if (
                          res.loadType === "TRACK_LOADED" ||
                          res.loadType === "SEARCH_RESULT"
                        ) {
                            await interaction.deferReply();
                            player.queue.add(res.tracks[0])
                            const enqueueEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription(
                                 `🎶 | Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`
                                )
                                .setTimestamp();
                        
                            if (!player.playing && !player.paused && !player.queue.size) 
                            await player.play()
                            
                            if (player.queue.totalSize > 1)
                            enqueueEmbed.addFields([
                              {
                                name: "Position in queue",
                                value: `${player.queue.size - 0}`,
                              },
                            ]);
                          return interaction.editReply({ embeds: [enqueueEmbed] });
                        }
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }
                  break;           
                //     const query = interaction.options.getString("query");
                //     res = await player.search(query, interaction.user.username);

                //     if (res.loadType === "LOAD_FAILED") {
                //         if (!player.queue.current) player.destroy();
                //         return interaction.reply({embeds: [
                //             new EmbedBuilder()
                //             .setColor("BLURPLE")
                //             .setDescription("🔹| An error has occured while trying to add this song.")
                //         ],
                //         ephemeral: true})
                //     }

                //     if (res.loadType === "NO_MATCHES") {
                //         if (!player.queue.current) player.destroy();
                //         return interaction.reply({embeds: [
                //             new EmbedBuilder()
                //             .setColor("BLURPLE")
                //             .setDescription("🔹| No results found.")
                //         ],
                //         ephemeral: true})
                //     }

                //     if (res.loadType === "PLAYLIST_LOADED") {
                //         player.connect();
                //         player.queue.add(res.tracks);
                //         if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                //         const playlistEmbed = new EmbedBuilder()
                //             .setDescription(`🔹 | **[${res.playlist.name}](${query})** has been added to the queue.`)
                //             .addFields({name: "Enqueued", value: `\`${res.tracks.length}\` tracks`})
                //         return interaction.reply({ embeds: [playlistEmbed] })
                //     }

                //     if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                //         player.connect();
                //         player.queue.add(res.tracks[0]);
                //     }

                //     const enqueueEmbed = new EmbedBuilder()
                //         .setColor("BLURPLE")
                //         .setDescription(`Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`)
                //     await interaction.reply({ embeds: [enqueueEmbed] });

                //     if (!player.playing && !player.paused && !player.queue.size) player.play()
                    
                //     if (player.queue.totalSize > 1)
                //     enqueueEmbed.addFields({name:"Position in queue", value: `${player.queue.size - 0}`});
                //     return interaction.editReply({ embeds: [enqueueEmbed] })
                // }
                case "volume": {
                    const volume = options.getNumber("percent");
                    if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
                        new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
                        ],
                        ephemeral: true});
                    if (!player.playing)
                        return interaction.reply({embeds: [
                            new EmbedBuilder()
                            .setColor("#FF0000")
                            .setDescription("🔸| There is nothing in the queue.")
                        ],
                        ephemeral: true});
                    if (volume < 0 || volume > 100)
                        return interaction.reply({embeds: [
                            new EmbedBuilder()
                            .setColor("#FF0000")
                            .setDescription("🔸| There is nothing in the queue.")
                        ],
                        ephemeral: true});
                    player.setVolume(volume);
                    const volumeEmbed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription(
                            `🔊 | Volume has been set to **${player.volume}%**.`
                        );
                    return interaction.reply({
                        embeds: [volumeEmbed]
                    });
                }
                case "repeat": {
                    if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
                        new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
                        ],
                        ephemeral: true});
                    switch (options.getString("type")) {
                        case "none": {
                            if (!player.trackRepeat && !player.queueRepeat)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| Repeat mode is not enabled at all.")
                                ],
                                ephemeral: true});

                            if (player.trackRepeat) {
                                player.setTrackRepeat(false);
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#008000")
                                    .setDescription("🔸| Repeat mode has been disabled. (Song)")
                                ],
                                ephemeral: true}
                                );
                            }

                            if (player.queueRepeat) {
                                player.setQueueRepeat(false);
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#008000")
                                    .setDescription("🔸| Repeat mode has been disabled. (Queue)")
                                ],
                                ephemeral: true});
                            }
                        }
                        case "queue": {
                            if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
                                ],
                                ephemeral: true});
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});
                            if (!player.queue.length)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});

                            if (!player.queueRepeat) {
                                player.setQueueRepeat(true);
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#008000")
                                    .setDescription("🔁 | Repeat mode has been enabled. (Queue)")
                                ],
                                ephemeral: true});
                            }
                        }
                        case "song": {
                            if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
                                new EmbedBuilder()
                                .setColor("#FF0000")
                                .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
                                ],
                                ephemeral: true});
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});

                            if (!player.trackRepeat) {
                                player.setTrackRepeat(true);
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔁 | Repeat mode has been enabled. (Song)")
                                ],
                                ephemeral: true});
                            }
                        }
                    }
                }
                case "settings": {
                    if (!VoiceChannel || player.queue.current == null) return interaction.reply({ embeds: [
                        new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription("🔸| There is nothing in the queue or you don't joined the voice channel yet.")
                        ],
                        ephemeral: true});
                    switch (options.getString("options")) {
                        case "skip": {
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});
                            await player.stop();

                            const skipEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription(`⏭️ | Skipped.`)
                                .setTimestamp();

                            return interaction.reply({
                                embeds: [skipEmbed],
                                ephemeral: true
                            });
                        }
                        case "nowplaying": {
                            const track = player.queue.current;

                            const npEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setTitle("🎶| Now Playing")
                                .setDescription(
                                    `[${track.title}](${track.uri}) [${player.queue.current.requester}]`
                                )
                                .setTimestamp();
                            return interaction.reply({
                                embeds: [npEmbed]
                            });
                        }
                        case "pause": {
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});

                            await player.pause(true);

                            const pauseEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription("⏸️ | Paused.");
                            return interaction.reply({
                                embeds: [pauseEmbed],
                                ephemeral: true
                            });
                        }
                        case "resume": {
                            await player.pause(false);

                            const resumeEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription("▶️ | Resumed.");
                            return interaction.reply({
                                embeds: [resumeEmbed],
                                ephemeral: true
                            });
                        }
                        case "stop": {
                            player.destroy();

                            const disconnectEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription("⏹️ | Disconnected.");
                            return interaction.reply({
                                embeds: [disconnectEmbed]
                            });
                        }
                        case "lyrics": {
                            await interaction.deferReply();

                            const track = player.queue.current;
                            const trackTitle = track.title
                                .replace("(Official Video)", "")
                                .replace("(Official Audio)", "");
                            const actualTrack = await gClient.songs.search(trackTitle);
                            const searches = actualTrack[0];
                            const lyrics = await searches.lyrics();

                            const lyricsEmbed = new EmbedBuilder()
                                .setColor("#007fff")
                                .setTitle(`📃 | Lyrics for **${trackTitle}**`)
                                .setDescription(lyrics)
                                .setFooter({
                                    text: "Provided by Genius"
                                })
                                .setTimestamp();
                            return interaction.editReply({
                                embeds: [lyricsEmbed]
                            });
                        }
                        case "shuffle": {
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});
                            if (!player.queue.length)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});

                            player.queue.shuffle();

                            const shuffleEmbed = new EmbedBuilder()
                                .setColor("#008000")
                                .setDescription("🔀 | Shuffled the queue.");
                            return interaction.reply({
                                embeds: [shuffleEmbed]
                            });
                        }
                        case "queue": {
                            
                            if (!player.playing)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});
                            if (!player.queue.length)
                                return interaction.reply({embeds: [
                                    new EmbedBuilder()
                                    .setColor("#007fff")
                                    .setDescription("🔸| There is nothing in the queue.")
                                ],
                                ephemeral: true});

                            const queue = player.queue.map(
                                (t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`
                            );
                            const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));

                            const queueEmbed = new EmbedBuilder()
                                .setColor("#007fff")
                                .setAuthor({
                                    name: `🔹| Current queue for ${guild.name}`
                                })
                                .setTitle(
                                    `🎶 | Currently playing: ${player.queue.current.title}`
                                )
                                .setDescription(chunked[0])
                                .setTimestamp();
                            return interaction.reply({
                                embeds: [queueEmbed]
                            });
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
};
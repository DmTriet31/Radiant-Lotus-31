/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const cmdIcons = require('../../UI/icons/commandicons');
const { autoplayCollection } = require('../../mongodb');
const { playlistCollection } = require('../../mongodb');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music player commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a song or playlist in the voice channel.')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Enter the song name or URL.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nowplaying')
                .setDescription('Get information about the currently playing song.'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('loop')
                        .setDescription('Toggle looping mode for the current track or the entire queue.')
                        .addStringOption(option =>
                            option.setName('mode')
                                .setDescription('Select loop mode: none, track, or queue.')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Disable Loop', value: 'none' },
                                    { name: 'Track Loop', value: 'track' },
                                    { name: 'Queue Loop', value: 'queue' }
                                )))
                        
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pause the currently playing song.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription('Resume the paused song.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('shuffle')
                .setDescription('Shuffle the queue.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Skip the current song.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop the music and clear the queue.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('View the current music queue.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a specific song from the queue.')
                .addIntegerOption(option =>
                    option.setName('track')
                        .setDescription('Track number to remove.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('createplaylist')
                .setDescription('Create a new playlist.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Playlist name.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('visibility')
                        .setDescription('Choose if the playlist is public or private.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Public', value: 'public' },
                            { name: 'Private', value: 'private' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('playplaylist')
                .setDescription('Play a saved playlist.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Playlist name.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('viewmyplaylists')
                .setDescription('View your saved playlists.'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('viewmyplaylistsongs')
                        .setDescription('View songs in your playlist.')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('Playlist name.')
                                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('allplaylists')
                .setDescription('View all public playlists.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletesong')
                .setDescription('Remove a song from your playlist.')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('Playlist name.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('index')
                        .setDescription('Song index to remove.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('deleteplaylist')
                .setDescription('Delete your playlist.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Playlist name.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('autoplay')
                .setDescription('Enable or disable autoplay.')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable or disable autoplay.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('addsong')
                .setDescription('Add a song to a playlist.')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('The playlist name.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('Enter song name or URL.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Set the music volume (0-100).')
                .addIntegerOption(option =>
                    option.setName('level')
                        .setDescription('Volume level (0-100).')
                        .setRequired(true))),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();
            const player = interaction.client.riffy.players.get(interaction.guild.id);
            const userId = interaction.user.id;
            const guildId = interaction.guild.id;

            if (subcommand === 'play') {
                const query = interaction.options.getString('query');
                const member = interaction.member;
                const { channel } = member.voice;

                if (!channel) {
                    return interaction.editReply({ content: '❌ You must be in a voice channel to play music.', flags: 64 });
                }

                const permissions = channel.permissionsFor(interaction.client.user);
                if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
                    return interaction.editReply({ content: '❌ I need permission to connect & speak in the voice channel.', flags: 64 });
                }

                let player = interaction.client.riffy.players.get(interaction.guild.id);
                if (!player) {
                    try {
                        player = await interaction.client.riffy.createConnection({
                            guildId: interaction.guild.id,
                            voiceChannel: channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true
                        });
                    } catch (error) {
                        console.error('Error creating player:', error);
                        return interaction.editReply({ content: '❌ Failed to connect to the voice channel.', flags: 64 });
                    }
                }

                try {
                    const resolve = await interaction.client.riffy.resolve({
                        query,
                        requester: interaction.user
                    });

                    const { loadType, tracks, playlistInfo } = resolve;

                    if (!tracks || tracks.length === 0) {
                        return interaction.editReply({ content: '❌ No results found for your query.', flags: 64 });
                    }

                    if (loadType === 'playlist') {
                        for (const track of tracks) {
                            track.requester = interaction.user;
                            player.queue.add(track);
                        }

                        const playlistEmbed = new EmbedBuilder()
                            .setColor('#DC92FF')
                            .setAuthor({ name: 'Playlist Added', iconURL: musicIcons.correctIcon })
                            .setFooter({ text: 'Now playing', iconURL: musicIcons.footerIcon })
                            .setDescription(`✅ Added **${playlistInfo.name}** with **${tracks.length}** tracks to the queue.`);

                        await interaction.editReply({ embeds: [playlistEmbed] });

                        if (!player.playing && !player.paused) player.play();

                    } else {
                        const track = tracks[0];
                        track.requester = interaction.user;
                        player.queue.add(track);

                        const trackEmbed = new EmbedBuilder()
                            .setColor('#DC92FF')
                            .setAuthor({ name: 'Track Added', iconURL: musicIcons.correctIcon })
                            .setFooter({ text: 'Now playing', iconURL: musicIcons.footerIcon })
                            .setDescription(`🎵 Added **${track.info.title}** to the queue.`);

                        await interaction.editReply({ embeds: [trackEmbed] });

                        if (!player.playing && !player.paused) player.play();
                    }

                } catch (error) {
                    console.error('Error resolving query:', error);
                    return interaction.editReply({ content: `❌ Error searching for music: ${error.message}`, flags: 64 });
                }
            }


            if (subcommand === 'pause') {
                player.pause(true);
                await interaction.editReply({ content: '⏸️ The song has been paused.' });

            } else if (subcommand === 'resume') {
                player.pause(false);
                await interaction.editReply({ content: '▶️ The song has been resumed.' });

            } else if (subcommand === 'shuffle') {
                player.queue.shuffle();
                await interaction.editReply({ content: '🔀 The queue has been shuffled.' });

            } else if (subcommand === 'skip') {
                player.stop();
                await interaction.editReply({ content: '⏭️ The song has been skipped.' });

            } else if (subcommand === 'stop') {
                player.destroy();
                await interaction.editReply({ content: '⏹️ The music has been stopped, and the queue has been cleared.' });

            } else if (subcommand === 'queue') {
                const queue = player.queue;
                if (!queue || queue.length === 0) {
                    return interaction.editReply({ content: '❌ The queue is empty.', flags: 64 });
                }
                await interaction.editReply({ content: `🎶 Queue: ${queue.map((track, i) => `${i + 1}. **${track.info.title}**`).join('\n')}` });

            } else if (subcommand === 'loop') {
                const mode = interaction.options.getString('mode');
            
                // Check if a player instance exists
                if (!player) {
                    return interaction.editReply({ content: '❌ There is no active player for this guild.', flags: 64 });
                }
            
                try {
                    // Set the loop mode: "none", "track", or "queue"
                    player.setLoop(mode);
                    await interaction.editReply({ content: `🔄 Loop mode set to **${mode}**.` });
                } catch (error) {
                    console.error('Error setting loop mode:', error);
                    await interaction.editReply({ content: '❌ Failed to set loop mode.', flags: 64 });
                }
            } else if (subcommand === 'remove') {
                const trackNumber = interaction.options.getInteger('track');
                if (trackNumber < 1 || trackNumber > player.queue.length) {
                    return interaction.editReply({ content: '❌ Invalid track number.', flags: 64 });
                }
                player.queue.remove(trackNumber - 1);
                await interaction.editReply({ content: `🗑️ Removed track #${trackNumber} from the queue.` });

            } else if (subcommand === 'volume') {
                const volume = interaction.options.getInteger('level');
                if (volume < 0 || volume > 100) {
                    return interaction.editReply({ content: '❌ Volume must be between 0 and 100.', flags: 64 });
                }
                player.setVolume(volume);
                await interaction.editReply({ content: `🔊 Volume set to **${volume}%**.` });
            }
            if (subcommand === 'createplaylist') {
                const name = interaction.options.getString('name');
                const visibility = interaction.options.getString('visibility');

                const existingPlaylist = await playlistCollection.findOne({ name, owner: userId });
                if (existingPlaylist) {
                    return interaction.editReply({ content: `❌ A playlist with this name already exists.`, ephemeral: true });
                }

                await playlistCollection.insertOne({
                    name,
                    owner: userId,
                    visibility,
                    songs: []
                });

                interaction.editReply({ content: `✅ Playlist **${name}** created as **${visibility}**.`, ephemeral: true });
            }

            // 🎶 PLAY PLAYLIST
            else if (subcommand === 'playplaylist') {
                const name = interaction.options.getString('name');
                const playlist = await playlistCollection.findOne({ name });
            
                if (!playlist) {
                    return interaction.editReply({ content: `❌ Playlist **${name}** not found.`, ephemeral: true });
                }
            
                if (playlist.visibility === 'private' && playlist.owner !== userId) {
                    return interaction.editReply({ content: `❌ You do not have permission to play this private playlist.`, ephemeral: true });
                }
            
                if (playlist.songs.length === 0) {
                    return interaction.editReply({ content: `❌ This playlist is empty.`, ephemeral: true });
                }
            
                const member = interaction.member;
                const { channel } = member.voice;
                
                if (!channel) {
                    return interaction.editReply({ content: '❌ You must be in a voice channel to play a playlist.', ephemeral: true });
                }
            
                const permissions = channel.permissionsFor(interaction.client.user);
                if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
                    return interaction.editReply({ content: '❌ I need permission to connect & speak in the voice channel.', ephemeral: true });
                }
            
                let player = interaction.client.riffy.players.get(guildId);
                
                if (!player) {
                    try {
                        player = await interaction.client.riffy.createConnection({
                            guildId,
                            voiceChannel: channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true
                        });
                    } catch (error) {
                        console.error('Error creating player:', error);
                        return interaction.editReply({ content: '❌ Failed to connect to the voice channel.', ephemeral: true });
                    }
                }
            
                // 🔄 Resolve and add all songs in the playlist
                let addedTracks = 0;
                for (const song of playlist.songs) {
                    try {
                        const resolve = await interaction.client.riffy.resolve({ query: song, requester: interaction.user });
            
                        if (resolve.tracks.length > 0) {
                            const track = resolve.tracks[0];
                            track.requester = interaction.user;
                            player.queue.add(track);
                            addedTracks++;
                        }
                    } catch (error) {
                        console.warn(`Failed to resolve track: ${song}`, error);
                    }
                }
            
                if (addedTracks === 0) {
                    return interaction.editReply({ content: `❌ Could not resolve any valid tracks from playlist **${name}**.`, ephemeral: true });
                }
            
                interaction.editReply({ content: `🎵 Now playing playlist **${name}** with **${addedTracks}** songs!` });
            
                if (!player.playing && !player.paused) {
                    player.play();
                }
            }
            
            else if (subcommand === 'viewmyplaylists') {
                const playlists = await playlistCollection.find({ owner: userId }).toArray();
                if (playlists.length === 0) {
                    return interaction.editReply({ content: `❌ You have no saved playlists.`, ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor('#3498db')
                    .setTitle('🎶 Your Playlists')
                    .setDescription(playlists.map(p => `- **${p.name}** (${p.visibility})`).join('\n'));

                interaction.editReply({ embeds: [embed] });
            }

            // 🌍 VIEW ALL PUBLIC PLAYLISTS
            else if (subcommand === 'allplaylists') {
                const playlists = await playlistCollection.find({ visibility: 'public' }).toArray();
                if (playlists.length === 0) {
                    return interaction.editReply({ content: `❌ No public playlists available.`, ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor('#2ECC71')
                    .setTitle('🌍 Public Playlists')
                    .setDescription(playlists.map(p => `- **${p.name}** (Owner: <@${p.owner}>)`).join('\n'));

                interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'autoplay') {
                const enable = interaction.options.getBoolean('enabled'); // or 'enable'
                await autoplayCollection.updateOne(
                    { guildId },
                    { $set: { autoplay: enable } },
                    { upsert: true }
                );
                interaction.editReply({ content: `✅ Autoplay is now **${enable ? 'enabled' : 'disabled'}**.` });
            }
            
               else if (subcommand === 'addsong') {
                const playlistName = interaction.options.getString('playlist');
                const songInput = interaction.options.getString('song'); 
    
                const playlist = await playlistCollection.findOne({ name: playlistName });
    
                if (!playlist) {
                    return interaction.editReply({ content: `❌ Playlist **${playlistName}** not found.`, ephemeral: true });
                }
    
                if (playlist.visibility === 'private' && playlist.owner !== userId) {
                    return interaction.editReply({ content: `❌ You do not have permission to add songs to this private playlist.`, ephemeral: true });
                }
    
                // Add song to the playlist
                await playlistCollection.updateOne(
                    { name: playlistName },
                    { $push: { songs: songInput } }
                );
    
                interaction.editReply({ content: `✅ Added **"${songInput}"** to playlist **${playlistName}**.` });
            }   else if (subcommand === 'viewmyplaylistsongs') {
                const playlistName = interaction.options.getString('name');
                const playlist = await playlistCollection.findOne({ name: playlistName });
    
                if (!playlist) {
                    return interaction.editReply({ content: `❌ Playlist **${playlistName}** not found.`, ephemeral: true });
                }
    
                if (playlist.visibility === 'private' && playlist.owner !== userId) {
                    return interaction.editReply({ content: `❌ You do not have permission to view this private playlist.`, ephemeral: true });
                }
    
                if (playlist.songs.length === 0) {
                    return interaction.editReply({ content: `❌ This playlist is empty.`, ephemeral: true });
                }
    
              
                const songList = playlist.songs.slice(0, 10).map((song, index) => `**${index + 1}.** ${song}`).join('\n');
    
                const embed = new EmbedBuilder()
                    .setColor('#3498db')
                    .setTitle(`🎵 Songs in ${playlistName}`)
                    .setDescription(songList)
                    .setFooter({ text: playlist.songs.length > 10 ? `+ ${playlist.songs.length - 10} more songs...` : "End of playlist" });
    
                interaction.editReply({ embeds: [embed] });
            }   
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: "Alert!",
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash commands!\n- Please use `/music`')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }

};

/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/

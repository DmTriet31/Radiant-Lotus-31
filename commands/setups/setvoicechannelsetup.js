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

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { voiceChannelCollection } = require('../../mongodb');
const { sendOrUpdateCentralizedEmbed, loadConfig } = require('../../events/voiceChannelHandler');
const cmdIcons = require('../../UI/icons/commandicons');
const { serverConfigCollection } = require('../../mongodb'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvoicechannelsetup')
        .setDescription('Set or view the voice channel setup for a server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)

        // Set voice channel configuration
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set the voice channel configuration for the server')
                .addStringOption(option =>
                    option.setName('serverid')
                        .setDescription('The ID of the server')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('voicechannelid')
                        .setDescription('The ID of the main voice channel')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('managerchannelid')
                        .setDescription('The ID of the manager channel')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('status')
                        .setDescription('The status of the voice channel setup')
                        .setRequired(true))
        )

        // View voice channel configuration
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('View the current voice channel setup')
                .addStringOption(option =>
                    option.setName('serverid')
                        .setDescription('The ID of the server')
                        .setRequired(true))
        ),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            const guild = interaction.guild;
            const serverID = interaction.guild.id;
            const configMangerData = await serverConfigCollection.findOne({ serverID });
            const botManagers = configMangerData ? configMangerData.botManagers || [] : [];
      
            if (!botManagers.includes(interaction.user.id) && interaction.user.id !== guild.ownerId) {
                return interaction.reply({ 
                    content: '❌ Only the **server owner** or **bot managers** can use this command.', 
                    flags: 64
                });
            }
            const subcommand = interaction.options.getSubcommand();
            const serverId = interaction.options.getString('serverid');

            // Ensure the provided server ID matches the actual guild ID.
            if (serverId !== guild.id) {
                return interaction.reply({ content: 'The server ID provided does not match this server\'s ID.', flags: 64 });
            }

            // Fetch server configuration
            const configData = await voiceChannelCollection.findOne({ serverId });

            if (subcommand === 'set') {
                // Get options
                const voiceChannelId = interaction.options.getString('voicechannelid');
                const managerChannelId = interaction.options.getString('managerchannelid');
                const status = interaction.options.getBoolean('status');
                
                if (!serverId || !voiceChannelId || !managerChannelId || status === null) {
                    return interaction.reply({ content: 'Invalid input. Please provide valid server ID, voice channel ID, manager channel ID, and status.', flags: 64 });
                }

                // Check permissions: Only server owner or assigned owner can update settings.
                const serverOwnerId = guild.ownerId;

                // Update the database
                await voiceChannelCollection.updateOne(
                    { serverId },
                    { $set: { serverId, voiceChannelId, managerChannelId, status, ownerId: serverOwnerId } },
                    { upsert: true }
                );

                // Reload settings and update centralized embed
                await loadConfig();
                await sendOrUpdateCentralizedEmbed(interaction.client, guild);

                return interaction.reply({ content: `Voice channel setup updated successfully for server ID ${serverId}.`, flags: 64 });

            } else if (subcommand === 'view') {
                if (!configData) {
                    return interaction.reply({ content: 'No voice channel configuration found for this server.', flags: 64 });
                }

                // Create an embed with server configuration details
                const embed = new EmbedBuilder()
                    .setColor('#3498db')
                    .setTitle('Voice Channel Configuration')
                    .setDescription(`
                        **Server ID:** ${configData.serverId}
                        **Voice Channel ID:** ${configData.voiceChannelId}
                        **Manager Channel ID:** ${configData.managerChannelId}
                        **Status:** ${configData.status ? 'Enabled' : 'Disabled'}
                    `)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], flags: 64 });
            }
        } else {
            // Not a slash command usage.
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: "Alert!",
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash commands!\n- Please use `/setvoicechannelsetup`')
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
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

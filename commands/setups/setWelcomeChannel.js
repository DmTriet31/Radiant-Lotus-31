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
const { welcomeCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
const { serverConfigCollection } = require('../../mongodb'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomechannel')
        .setDescription('Set or view the welcome channel for a server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)

        // Set welcome channel configuration
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set the welcome channel for the server')
                .addStringOption(option =>
                    option.setName('serverid')
                        .setDescription('The ID of the server')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('channelid')
                        .setDescription('The ID of the welcome channel')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('status')
                        .setDescription('Enable or disable the welcome channel')
                        .setRequired(true))
        )

        // View welcome channel configuration
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('View the current welcome channel setup')
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

        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match this server.', flags: 64 });
        }

        // Fetch server configuration
        const configData = await welcomeCollection.findOne({ serverId });

        if (subcommand === 'set') {
            const channelId = interaction.options.getString('channelid');
            const status = interaction.options.getBoolean('status');

            if (!serverId || !channelId || status === null) {
                return interaction.reply({ content: 'Invalid input. Please provide valid server ID, channel ID, and status.', flags: 64 });
            }

            // Check permissions: Only the server owner or assigned owners can modify settings.
            const serverOwnerId = guild.ownerId;
   
            // Update the database
            await welcomeCollection.updateOne(
                { serverId },
                { $set: { serverId, welcomeChannelId: channelId, status, ownerId: serverOwnerId } },
                { upsert: true }
            );

            return interaction.reply({ content: `Welcome channel updated successfully for server ID ${serverId}.`, flags: 64 });

        } else if (subcommand === 'view') {
            if (!configData) {
                return interaction.reply({ content: 'No welcome channel configuration found for this server.', flags: 64 });
            }

            // Create an embed with server configuration details
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle('Welcome Channel Configuration')
                .setDescription(`
                    **Server ID:** ${configData.serverId}
                    **Welcome Channel ID:** ${configData.welcomeChannelId}
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
            .setDescription('- This command can only be used through slash commands!\n- Please use `/setwelcomechannel`')
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

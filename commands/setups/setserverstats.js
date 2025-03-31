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


const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { serverStatsCollection, logsCollection } = require('../../mongodb');

const statTypes = ["members", "bots", "textchannels", "voicechannels", "categories", "roles"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Manage server statistics channels')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        
        .addSubcommand(sub => 
            sub.setName('setup')
                .setDescription('Configure server stats channels')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Select which stat to track')
                        .setRequired(true)
                        .addChoices({ name: 'All Stats', value: 'all' }, ...statTypes.map(type => ({ name: type, value: type }))))
                .addBooleanOption(option => option.setName('active').setDescription('Enable or disable this stat').setRequired(true))
                .addChannelOption(option => option.setName('category').setDescription('Select a category').addChannelTypes(ChannelType.GuildCategory).setRequired(false))
                .addStringOption(option => option.setName('name').setDescription('Custom name (use {count})').setRequired(false))
        )

        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('View the current server stats setup')
        )

        .addSubcommand(sub =>
            sub.setName('delete')
                .setDescription('Delete a specific server stat entry')
                .addIntegerOption(option => 
                    option.setName('index')
                        .setDescription('Index of the stat to delete (from /serverstats view)')
                        .setRequired(true))
        )

        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Delete all server stats setups')
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        const guild = interaction.guild;
        const guildId = guild.id;
        const subcommand = interaction.options.getSubcommand();

        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.editReply({ content: '❌ I need `Manage Channels` permission!' });
        }

        if (subcommand === "setup") {
            const type = interaction.options.getString('type');
            const active = interaction.options.getBoolean('active');
            const category = interaction.options.getChannel('category');
            const categoryId = category ? category.id : null;
            const customName = interaction.options.getString('name');

            const typesToCreate = type === "all" ? ["members", "bots", "textchannels", "voicechannels", "categories", "roles"] : [type];

            for (const stat of typesToCreate) {
                const nameFormat = customName || `{count} ${stat}`;
                let existingChannel = guild.channels.cache.find(ch => ch.name.includes(stat));

                if (!existingChannel && active) {
                    try {
                        existingChannel = await guild.channels.create({
                            name: nameFormat.replace('{count}', 0),
                            type: ChannelType.GuildVoice,
                            parent: categoryId || null,
                            permissionOverwrites: [{ id: guild.roles.everyone.id, deny: ['Connect'] }]
                        });
                    } catch (err) {
                        return interaction.editReply({ content: `❌ Failed to create stats channel for ${stat}.` });
                    }
                }

                await serverStatsCollection.updateOne(
                    { guildId, type: stat },
                    { $set: { guildId, channelId: existingChannel?.id || null, categoryId, active, customName: nameFormat } },
                    { upsert: true }
                );
            }

            return interaction.editReply({
                content: `✅ **${type === "all" ? "All Stats" : type}** are now **${active ? 'enabled' : 'disabled'}**.`,
            });

        } else if (subcommand === "view") {
            const stats = await serverStatsCollection.find({ guildId }).toArray();
            
            if (!stats.length) return interaction.editReply({ content: '📊 No server stats are currently set up.' });

            const statsList = stats.map((s, i) => 
                `\`${i + 1}\` | **${s.type}** → <#${s.channelId || 'N/A'}> | **Active:** ${s.active ? '✅' : '❌'}`  
            ).join("\n");

            return interaction.editReply({ content: `📊 **Server Stats Setup:**\n${statsList}` });

        } else if (subcommand === "delete") {
            const index = interaction.options.getInteger('index') - 1;
            const stats = await serverStatsCollection.find({ guildId }).toArray();

            if (index < 0 || index >= stats.length) return interaction.editReply({ content: '❌ Invalid index provided.' });

            const statToDelete = stats[index];
            await serverStatsCollection.deleteOne({ _id: statToDelete._id });

            if (statToDelete.channelId) {
                const channel = guild.channels.cache.get(statToDelete.channelId);
                if (channel) await channel.delete().catch(() => {});
            }

            return interaction.editReply({ content: `✅ Deleted **${statToDelete.type}** server stat.` });

        } else if (subcommand === "clear") {
            await serverStatsCollection.deleteMany({ guildId });

            return interaction.editReply({ content: `✅ All server stats have been deleted.` });
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

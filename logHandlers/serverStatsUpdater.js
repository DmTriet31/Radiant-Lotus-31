const { serverStatsCollection } = require('../mongodb');
const { ChannelType } = require('discord.js');

const UPDATE_INTERVAL = 5 * 60 * 1000;

async function fetchStats(guild) {
    try {
        await guild.members.fetch(); 
        await guild.channels.fetch();
        const roles = await guild.roles.fetch(); 

        return {
            all: guild.memberCount,
            members: guild.members.cache.filter(m => !m.user.bot).size,
            bots: guild.members.cache.filter(m => m.user.bot).size,
            textchannels: guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).size,
            voicechannels: guild.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size,
            categories: guild.channels.cache.filter(ch => ch.type === ChannelType.GuildCategory).size,
            roles: roles.size
        };
    } catch (error) {
        console.error(`Error fetching stats for guild: ${guild.id}`, error);
        return null;
    }
}

async function updateServerStats(guild) {
    const statsData = await fetchStats(guild);
    if (!statsData) return; 

    const stats = await serverStatsCollection.find({ guildId: guild.id, active: true }).toArray();

    for (const stat of stats) {
        const channel = guild.channels.cache.get(stat.channelId);
        if (!channel) continue;

        const count = statsData[stat.type] || 0;
        const newName = stat.customName.replace('{count}', count);

        if (channel.name !== newName) {
            await channel.setName(newName).catch(() => {});
        }
    }
}

module.exports = async (client) => {
 
    client.on('guildMemberAdd', async (member) => await updateServerStats(member.guild));
    client.on('guildMemberRemove', async (member) => await updateServerStats(member.guild));
    client.on('channelCreate', async (channel) => await updateServerStats(channel.guild));
    client.on('channelDelete', async (channel) => await updateServerStats(channel.guild));
    client.on('roleCreate', async (role) => await updateServerStats(role.guild));
    client.on('roleDelete', async (role) => await updateServerStats(role.guild));

    client.on('ready', async () => {
        //console.log(`✅ Server stats updater started! Running every ${UPDATE_INTERVAL / 60000} minutes.`);


        for (const guild of client.guilds.cache.values()) {
            await updateServerStats(guild);
        }

   
        setInterval(async () => {
            for (const guild of client.guilds.cache.values()) {
                await updateServerStats(guild);
            }
        }, UPDATE_INTERVAL);
    });
};

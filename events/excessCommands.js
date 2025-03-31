const { hentaiCommandCollection, serverConfigCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        // Fetch hentai settings
        const hentaiSettings = await hentaiCommandCollection.findOne({ serverId: message.guild.id });

        // Fetch server config
        let serverConfig;
        try {
            serverConfig = await serverConfigCollection.findOne({ serverId: message.guild.id });
        } catch (err) {
            console.error('Error fetching server configuration from MongoDB:', err);
        }

        const prefix = serverConfig?.prefix || config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get all folders in excesscommands directory
        const excessCommandsPath = path.join(__dirname, '..', 'excesscommands');
        let command;

        try {
            // Get all folders in the excesscommands directory
            const commandFolders = fs.readdirSync(excessCommandsPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            // Check each folder for the command
            for (const folder of commandFolders) {
                const commandPath = path.join(excessCommandsPath, folder, `${commandName}.js`);
                
                if (fs.existsSync(commandPath)) {
                    // Special handling for hentai commands
                    if (folder === 'hentai') {
                        if (!hentaiSettings?.status) {
                            return message.reply('Hentai commands are currently disabled.');
                        }
                    }

                    // Check if the folder is enabled in config
                    if (config.excessCommands && 
                        (folder === 'hentai' || config.excessCommands[folder])) {
                        command = require(commandPath);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading commands:', error);
            return message.reply('Error loading commands.');
        }

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Command Error')
                .setDescription(`An error occurred while executing the \`${commandName}\` command.`)
                .addFields({ name: 'Error Details:', value: error.message });

            message.reply({ embeds: [errorEmbed] });
        }
    }
};
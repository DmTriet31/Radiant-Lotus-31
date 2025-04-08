const fs = require('fs');
const path = require('path');
const { categories } = require('../config.json');
const lang = require('./loadLanguage');
const client = require('../main');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

       
        const category = command.category || 'undefined';

       
        if (!categories[category]) {
            console.warn(`Command in category '${category}' is disabled.`);
            try {
               
                await interaction.reply({ 
                    content: lang.commandDisabled, 
                    ephemeral: true 
                });
            } catch (replyError) {
                console.error('Error when sending command disabled reply:', replyError);
            }
            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            if (error.code === 10062) {
                return;
            }

            if (error.message.includes('Interaction has already been acknowledged') ||
                error.message.includes('Unknown Message')) {
                console.warn('Interaction already replied or deferred error suppressed');
                return;
            }

            console.error(error);

            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: lang.error, ephemeral: true });
                }
            } catch (replyError) {
                if (replyError.message.includes('Interaction has already been acknowledged') ||
                    replyError.message.includes('Unknown interaction')) {
                    return;
                }

                console.error('Error when sending error reply:', replyError);
            }
        }
    },
};
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // Lấy kênh admin (thay đổi tên kênh theo yêu cầu của bạn)
    const adminChannel = interaction.guild.channels.cache.find(ch => ch.name === 'admin-notifications');

    if (interaction.customId === 'buy_spotify') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Spotify Premium**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
        if (adminChannel) {
            await adminChannel.send(`Khách hàng **${interaction.user.tag}** đã mua **Spotify Premium**.`);
        }
    } else if (interaction.customId === 'buy_netflix') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Netflix Share**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
        if (adminChannel) {
            await adminChannel.send(`Khách hàng **${interaction.user.tag}** đã mua **Netflix Share**.`);
        }
    } else if (interaction.customId === 'buy_ao') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Áo Thun**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
        if (adminChannel) {
            await adminChannel.send(`Khách hàng **${interaction.user.tag}** đã mua **Áo Thun**.`);
        }
    }
});

const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).reduce((files, folder) => {
    const folderPath = path.join(commandsPath, folder);
    const fileNames = fs.readdirSync(folderPath);
    fileNames.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (file.endsWith('.js')) {
            const command = require(filePath);
            command.category = folder; 
            files.set(command.name, command);
        }
    });
    return files;
}, new Map());

client.commands = commandFiles;

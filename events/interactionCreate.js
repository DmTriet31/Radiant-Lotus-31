const { categories } = require('../config.json');
const lang = require('../handlers/loadLanguage');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            const category = command.category || 'undefined';

            if (!categories[category]) {
                try {
                    await interaction.reply({ content: lang.commandDisabled, ephemeral: true });
                } catch (replyError) {
                    console.error('Error sending commandDisabled message:', replyError);
                }
                return;
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (!interaction.replied && !interaction.deferred) {
                    try {
                        await interaction.reply({ content: lang.error, ephemeral: true });
                    } catch (replyError) {
                        console.error('Error replying to failed command:', replyError);
     
        else if (interaction.isButton()) {
            const adminChannel = interaction.guild.channels.cache.find(ch => ch.name === 'admin-notifications');

            const purchaseMap = {
                buy_spotify: 'Spotify Premium',
                buy_netflix: 'Netflix Share',
                buy_ao: 'Áo Thun'
            };

            const product = purchaseMap[interaction.customId];
            if (product) {
                await interaction.reply(`Cảm ơn bạn đã chọn mua **${product}**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.`);
                if (adminChannel) {
                    await adminChannel.send(`Khách hàng **${interaction.user.tag}** đã mua **${product}**.`);
                }
            }
        }
    },
};

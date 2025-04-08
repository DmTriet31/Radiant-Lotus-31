const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'shop',
    description: 'Hiển thị các sản phẩm trong cửa hàng của Radiant Lotus!',
    async execute(interaction) {
        // Tạo các nút bấm cho sản phẩm
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('buy_spotify')
                    .setLabel('Mua Spotify Premium')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('buy_netflix')
                    .setLabel('Mua Netflix Share')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('buy_ao')
                    .setLabel('Mua Áo Thun')
                    .setStyle('SUCCESS')
            );

        // Gửi thông báo về các sản phẩm
        await interaction.reply({
            content: 'Chào bạn! Đây là những sản phẩm chúng tôi đang bán:\n\n' +
                '**Spotify Premium** - 25k/tháng\n' +
                '**Netflix Share** - 40k/tháng\n' +
                '**Áo Thun** - 150k/áo\n\n' +
                'Bấm nút để mua sản phẩm bạn muốn!',
            components: [row],
        });
    },
};
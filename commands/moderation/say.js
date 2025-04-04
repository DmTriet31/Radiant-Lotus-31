const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một tin nhắn embed với tiêu đề là nội dung chính và chi tiết ở footer')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Tiêu đề chính (sẽ hiển thị to)')
                .setRequired(true)) // Tiêu đề chính là bắt buộc
        .addStringOption(option =>
            option.setName('des')
                .setDescription('Nội dung chi tiết')
                .setRequired(true)), // Nội dung chi tiết là bắt buộc

    async execute(interaction) {
        // Lấy thông tin từ người dùng nhập vào
        const title = interaction.options.getString('title'); // Lấy tiêu đề
        const description = interaction.options.getString('des'); // Lấy mô tả

        // Tạo một Embed với tiêu đề là nội dung chính và chi tiết ở footer
        const embed = new EmbedBuilder()
            .setColor(0x800080) // Màu tím (hex #800080)
            .setTitle(title) // Tiêu đề sẽ hiển thị to
            .setFooter({ text: description }) // Nội dung chi tiết sẽ nằm ở footer
            .setTimestamp();

        // Gửi Embed vào kênh
        await interaction.reply({ embeds: [embed] });
    },
};

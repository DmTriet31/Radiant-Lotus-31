const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một tin nhắn embed với tiêu đề và nội dung tùy chỉnh')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Tiêu đề chính (chữ to)')
                .setRequired(true)) // Tiêu đề là bắt buộc
        .addStringOption(option =>
            option.setName('des')
                .setDescription('Nội dung mô tả')
                .setRequired(true)), // Nội dung mô tả cũng bắt buộc

    async execute(interaction) {
        // Lấy thông tin từ người dùng nhập vào
        const title = interaction.options.getString('title'); // Lấy tiêu đề
        const description = interaction.options.getString('des'); // Lấy mô tả

        // Tạo một Embed với tiêu đề và mô tả
        const embed = new EmbedBuilder()
            .setColor(0x2f3136)  // Màu của Embed
            .setTitle(title) // Tiêu đề sẽ in đậm và to
            .setDescription(description) // Mô tả sẽ bình thường
            .setFooter({ text: `Gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Gửi Embed vào kênh
        await interaction.reply({ embeds: [embed] });
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một embed với tiêu đề và nội dung tùy chỉnh')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Tiêu đề chính (chữ to)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('des')
                .setDescription('Nội dung mô tả')
                .setRequired(true)),

    async execute(interaction) {
        const title = interaction.options.getString('title'); // Lấy tiêu đề
        const description = interaction.options.getString('des'); // Lấy nội dung mô tả

        const embed = new EmbedBuilder()
            .setColor(0x2f3136) // Màu embed (có thể thay đổi)
            .setTitle(title) // Tiêu đề lớn
            .setDescription(description) // Nội dung mô tả
            .setFooter({ text: `Gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
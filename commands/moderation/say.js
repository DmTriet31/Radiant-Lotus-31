const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi tin nhắn dưới dạng embed với tiêu đề và mô tả tùy chỉnh.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Tiêu đề của tin nhắn')
                .setRequired(true) // Bắt buộc nhập tiêu đề
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Nội dung tin nhắn')
                .setRequired(true) // Bắt buộc nhập mô tả
        ),
    async execute(interaction) {
        // Lấy title và description từ người dùng
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        // Tạo embed với nội dung được nhập
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};

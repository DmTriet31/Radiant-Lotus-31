const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một tin nhắn embed có tiêu đề to và nội dung phụ')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Tiêu đề chính (sẽ hiển thị to hơn)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Nội dung mô tả')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message') || ''; // Nếu không nhập, sẽ để trống

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(title) // Chữ này sẽ TO hơn
            .setDescription(message) // Chữ này sẽ bình thường
            .setFooter({ text: `Gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
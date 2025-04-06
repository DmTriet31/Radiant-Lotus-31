const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Mảng các hoạt động
const activities = [
    "Chơi game 🎮",
    "Đá banh ⚽",
    "Xem phim 🎬",
    "Đi ngủ 😴",
    "Đọc sách 📚",
    "Nghe nhạc 🎧"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomActivity')
        .setDescription('Random một hoạt động cho bạn!'),
    async execute(interaction) {
        // Random hoạt động
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];

        // Tạo embed với thêm thông tin bổ sung
        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setTitle('Random Activity')
            .setDescription(`Hôm nay, bạn có thể thử: **${randomActivity}**`)
            .addFields(
                { name: 'Lời khuyên', value: 'Hãy tận hưởng thời gian và thư giãn nhé!' }
            )
            // Bạn có thể thêm ảnh thumbnail ở đây
            //.setThumbnail('https://example.com/activity-thumbnail.png')
            .setTimestamp()
            .setFooter({ text: 'Activity Bot', iconURL: 'https://example.com/activity-icon.png' });

        await interaction.reply({ embeds: [embed] });
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');

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
        .setName('activity')
        .setDescription('Random một hoạt động cho bạn!'),
    async execute(interaction) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        await interaction.reply(`Hôm nay, bạn có thể: **${randomActivity}**`);
    },
};

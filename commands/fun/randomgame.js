const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Danh sách các trò chơi
const games = [
    "Valorant 🎮",
    "Minecraft ⛏️",
    "Liên Quân Mobile 📱",
    "League of Legends 🏆",
    "Free Fire 🔫"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomgame')
        .setDescription('Random game cho bạn chơi!'),
    async execute(interaction) {
        // Random game từ danh sách
        const randomGame = games[Math.floor(Math.random() * games.length)];

        // Tạo embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Random Game')
            .setDescription(`Hôm nay, bạn có thể thử chơi: **${randomGame}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

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

        // Tạo embed với thêm thông tin bổ sung
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Random Game')
            .setDescription(`Hôm nay, bạn có thể thử chơi: **${randomGame}**`)
            .addFields(
                { name: 'Lời khuyên', value: 'Chơi game để giải trí và thư giãn nhé!' }
            )
            // Nếu bạn có một ảnh thumbnail, có thể chèn vào đây
            //.setThumbnail('https://example.com/game-thumbnail.png')
            .setTimestamp()
            .setFooter({ text: 'Game Bot', iconURL: 'https://example.com/game-icon.png' });

        await interaction.reply({ embeds: [embed] });
    },
};

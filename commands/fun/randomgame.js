const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

// Mảng các trò chơi
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
        const randomGame = games[Math.floor(Math.random() * games.length)];
        await interaction.reply(`Hôm nay, bạn có thể thử chơi: **${randomGame}**`);
    },
};

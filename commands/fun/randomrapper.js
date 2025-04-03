const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Danh sách tên rapper Việt Nam
const rappers = [
    "Đen Vâu",
    "Suboi",
    "Karik",
    "Binz",
    "Rhymastic",
    "Touliver",
    "Only C",
    "Hieuthuhai",
    "Lowg",
    "MCK",
    "Wrdie"
];

// Danh sách các cặp emoji để tạo sự sinh động
const emojiSets = [
    "🎤🔥",
    "💥🎶",
    "💯🔊",
    "🎧⚡",
    "🔥💯",
    "💥🎤",
    "🎶💥",
    "🔊🎧"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomrapper')
        .setDescription('Random rapper Việt Nam để nghe!'),
    async execute(interaction) {
        // Random tên rapper và emoji
        const randomRapper = rappers[Math.floor(Math.random() * rappers.length)];
        const randomEmoji = emojiSets[Math.floor(Math.random() * emojiSets.length)];

        // Tạo embed để trả lời
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Random Rapper')
            .setDescription(`Hôm nay, bạn có thể nghe: **${randomRapper} ${randomEmoji}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

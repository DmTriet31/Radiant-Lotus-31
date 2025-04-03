const { SlashCommandBuilder } = require('@discordjs/builders');

// Mảng danh sách rapper Việt Nam (đã thêm các rapper mới)
const rappers = [
    "Đen Vâu 🎤",
    "Suboi 🎤",
    "Karik 🎤",
    "Binz 🎤",
    "Rhymastic 🎤",
    "Touliver 🎤",
    "Only C 🎤",
    "Hieuthuhai 🎤",
    "Lowg 🎤",
    "MCK 🎤",
    "Wrdie 🎤"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomrapper')
        .setDescription('Random rapper Việt Nam để nghe!'),
    async execute(interaction) {
        const randomRapper = rappers[Math.floor(Math.random() * rappers.length)];
        await interaction.reply(`Hôm nay, bạn có thể nghe: **${randomRapper}**`);
    },
};

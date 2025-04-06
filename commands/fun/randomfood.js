const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Mảng các món ăn
const foods = [
    "Phở 🍜",
    "Bánh mì 🥖",
    "Cơm tấm 🍚",
    "Bún bò Huế 🍲",
    "Gỏi cuốn 🥢",
    "Trà sữa 🧋"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('angi')
        .setDescription('Random một món ăn cho bạn!'),
    async execute(interaction) {
        const randomFood = foods[Math.floor(Math.random() * foods.length)];

        const embed = new EmbedBuilder()
            .setColor('#ff9966')
            .setTitle('🍽 Random Food')
            .setDescription(`Hôm nay bạn nên thử món: **${randomFood}**`)
            .addFields(
                { name: 'Gợi ý', value: 'Đi ăn ngay kẻo đói nha 😋' }
            )
            .setTimestamp()
            .setFooter({ text: 'Food Bot', iconURL: 'https://example.com/food-icon.png' });

        await interaction.reply({ embeds: [embed] });
    },
};

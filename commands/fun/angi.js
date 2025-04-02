const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('angi')
        .setDescription('Hôm nay nên ăn gì và uống gì?'),
    async execute(interaction) {
        const foods = ["🍜 Mì", "🥣 Phở", "🍲 Bún bò", "🍛 Cơm tấm", "🥟 Bánh xèo", "🍤 Bánh canh", "🥖 Bánh mì", "🍚 Cháo lòng", "🍢 Nem nướng", "🍝 Hủ tiếu"];
        const drinks = ["🥤 Trà sữa", "☕ Cà phê sữa đá", "🧃 Nước cam", "🍵 Trà đá", "🥛 Sữa đậu nành", "🍹 Nước mía", "🧋 Trà chanh", "🥤 Soda chanh"];

        const chosenFood = foods[Math.floor(Math.random() * foods.length)];
        const chosenDrink = drinks[Math.floor(Math.random() * drinks.length)];

        await interaction.reply(`🤔 Hôm nay bạn nên ăn: **${chosenFood}** và uống: **${chosenDrink}**!`);
    },
};

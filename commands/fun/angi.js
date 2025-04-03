const { SlashCommandBuilder } = require('@discordjs/builders');

// Mảng món ăn và nước uống
const foods = [
    "Bánh mì kẹp thịt",
    "Phở",
    "Bánh xèo",
    "Gỏi cuốn",
    "Cơm tấm",
    "Bánh bao"
];

const drinks = [
    "Nước mía",
    "Trà sữa",
    "Nước cam",
    "Sinh tố dâu",
    "Cà phê sữa đá",
    "Nước dừa"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('angi')
        .setDescription('Bot sẽ random món ăn và nước uống cho bạn!'),
    async execute(interaction) {
        // Random món ăn và nước uống
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

        // Gửi thông báo cho người dùng
        await interaction.reply(`Hôm nay bạn có thể thử món ăn: **${randomFood}** và uống: **${randomDrink}**.`);
    },
};

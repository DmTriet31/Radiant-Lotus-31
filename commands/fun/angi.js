const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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

        // Tạo embed với thông tin
        const embed = new EmbedBuilder()
            .setColor('#ff6347')  // Màu sắc của embed
            .setTitle('Random Món Ăn và Nước Uống')
            .setDescription(`🍽️ Hôm nay bạn có thể thử món ăn: **${randomFood}** và uống: **${randomDrink}** 🥤`)
            .addFields(
                { name: 'Lời khuyên', value: 'Hãy thưởng thức bữa ăn và tận hưởng ngày mới!' }
            )
            // Bạn có thể thêm ảnh thumbnail ở đây
            //.setThumbnail('https://example.com/food-thumbnail.png')
            .setTimestamp()
            .setFooter({ text: 'Food Bot', iconURL: 'https://example.com/food-icon.png' });

        await interaction.reply({ embeds: [embed] });
    },
};

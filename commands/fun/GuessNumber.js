const { SlashCommandBuilder } = require('discord.js');

let targetNumber = Math.floor(Math.random() * 100) + 1;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Đoán số từ 1 đến 100')
        .addIntegerOption(option => 
            option.setName('number')
                .setDescription('Số bạn đoán')
                .setRequired(true)
        ),
    async execute(interaction) {
        const userGuess = interaction.options.getInteger('number');

        if (userGuess > targetNumber) {
            await interaction.reply('Quá cao! Thử lại.');
        } else if (userGuess < targetNumber) {
            await interaction.reply('Quá thấp! Thử lại.');
        } else {
            await interaction.reply(`Chúc mừng! Bạn đã đoán đúng số ${targetNumber}.`);
            targetNumber = Math.floor(Math.random() * 100) + 1;
        }
    },
};

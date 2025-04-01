const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nemlon')
        .setDescription('Thử sức ném lon của bạn!')
        .addIntegerOption(option =>
            option.setName('power')
                .setDescription('Chọn lực ném (1-10)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)),
    async execute(interaction) {
        const playerThrow = interaction.options.getInteger('power');
        const botThrow = Math.floor(Math.random() * 10) + 1;

        let result;
        if (Math.abs(playerThrow - botThrow) <= 2) {
            result = "🎯 Bạn đã ném trúng lon! Chúc mừng!";
        } else {
            result = "😢 Bạn ném trượt rồi! Hãy thử lại.";
        }

        await interaction.reply(`🥫 Bạn ném với lực ${playerThrow}\n🤖 Bot chọn ${botThrow}\n\n${result}`);
    },
};

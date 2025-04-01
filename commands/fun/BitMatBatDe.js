const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bitmatbatde')
        .setDescription('Thử xem bạn có bắt được dê không!')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Chọn vị trí (1-5)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5)),
    async execute(interaction) {
        const playerChoice = interaction.options.getInteger('position');
        const goatPosition = Math.floor(Math.random() * 5) + 1;

        let result;
        if (playerChoice === goatPosition) {
            result = "🎉 Bạn đã bắt được dê!";
        } else {
            result = `😢 Dê đã chạy sang vị trí ${goatPosition}! Bạn thất bại.`;
        }

        await interaction.reply(`🤔 Bạn đoán vị trí ${playerChoice}\n🐐 Dê ở vị trí ${goatPosition}\n\n${result}`);
    },
};

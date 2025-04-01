const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anpho')
        .setDescription('Hôm nay nên ăn Phở hay Mì?'),
    async execute(interaction) {
        const choices = ["🍜 Mì", "🥣 Phở"];
        const choice = choices[Math.floor(Math.random() * choices.length)];

        await interaction.reply(`🤔 Hôm nay bạn nên ăn: **${choice}**!`);
    },
};

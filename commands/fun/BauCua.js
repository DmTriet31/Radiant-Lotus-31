const { SlashCommandBuilder } = require('discord.js');

const options = ['🐓 Gà', '🦀 Cua', '🍐 Bầu', '🦌 Nai', '🦐 Tôm', '🐟 Cá'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baucua')
        .setDescription('Chơi game Bầu Cua Tôm Cá!')
        .addStringOption(option => 
            option.setName('bet')
                .setDescription('Chọn con vật bạn đặt cược')
                .setRequired(true)
                .addChoices(
                    { name: 'Gà', value: '🐓 Gà' },
                    { name: 'Cua', value: '🦀 Cua' },
                    { name: 'Bầu', value: '🍐 Bầu' },
                    { name: 'Nai', value: '🦌 Nai' },
                    { name: 'Tôm', value: '🦐 Tôm' },
                    { name: 'Cá', value: '🐟 Cá' }
                )),
    async execute(interaction) {
        const bet = interaction.options.getString('bet');
        const dice1 = options[Math.floor(Math.random() * options.length)];
        const dice2 = options[Math.floor(Math.random() * options.length)];
        const dice3 = options[Math.floor(Math.random() * options.length)];

        const result = `🎲 Kết quả: ${dice1}, ${dice2}, ${dice3}`;
        if (bet === dice1 || bet === dice2 || bet === dice3) {
            await interaction.reply(`${result}\n🎉 Chúc mừng! Bạn đã thắng cược với ${bet}!`);
        } else {
            await interaction.reply(`${result}\n😢 Rất tiếc, bạn đã thua cược.`);
        }
    },
};

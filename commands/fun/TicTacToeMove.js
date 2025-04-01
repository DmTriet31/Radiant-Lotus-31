const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Chơi nước đi Tic-Tac-Toe')
        .addIntegerOption(option => 
            option.setName('position')
                .setDescription('Vị trí bạn muốn đánh (1-9)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const position = interaction.options.getInteger('position') - 1;
        const player = interaction.user;

        if (!players[player.id]) {
            return interaction.reply('Bạn không phải người chơi trong trận đấu này!');
        }
        if (currentTurn !== player.id) {
            return interaction.reply('Chưa đến lượt của bạn!');
        }
        if (board[position] === "❌" || board[position] === "⭕") {
            return interaction.reply('Vị trí này đã được đánh, hãy chọn chỗ khác.');
        }

        board[position] = players[player.id];

        let displayBoard = board.join(" ");
        if (checkWin(board, players[player.id])) {
            await interaction.reply(`🎉 ${player} đã thắng!\n\n${displayBoard}`);
            board = [...emptyBoard]; 
            return;
        }

        currentTurn = Object.keys(players).find(id => id !== currentTurn);
        await interaction.reply(`Lượt của <@${currentTurn}>\n\n${displayBoard}`);
    },
};

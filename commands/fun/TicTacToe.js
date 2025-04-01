const { SlashCommandBuilder } = require('discord.js');

const emptyBoard = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
let board = [...emptyBoard];
let players = {};
let currentTurn = null;

function checkWin(b, symbol) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // hàng ngang
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cột dọc
        [0, 4, 8], [2, 4, 6]            // đường chéo
    ];
    return winPatterns.some(pattern => pattern.every(i => b[i] === symbol));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Chơi Tic-Tac-Toe với người khác')
        .addUserOption(option => option.setName('opponent').setDescription('Người chơi đối thủ').setRequired(true)),
    async execute(interaction) {
        const player1 = interaction.user;
        const player2 = interaction.options.getUser('opponent');

        if (player1.id === player2.id) {
            return interaction.reply('Bạn không thể chơi với chính mình!');
        }

        players = { [player1.id]: "❌", [player2.id]: "⭕" };
        currentTurn = player1.id;
        board = [...emptyBoard];

        let displayBoard = board.join(" ");
        await interaction.reply(`Bắt đầu trò chơi giữa ${player1} và ${player2}!\n\n${displayBoard}`);
    },
};


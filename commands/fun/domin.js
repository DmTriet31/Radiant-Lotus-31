const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('domin')
        .setDescription('Chơi game mở hộp quà với cơ hội nhận Radiant Coins'),

    async execute(interaction) {
        const gameBoard = [];
        for (let i = 0; i < 20; i++) {
            const random = Math.random();
            if (random < 0.35) gameBoard.push('💣');        // 35% là bom
            else if (random < 0.65) gameBoard.push('💸');   // 30% là coin
            else gameBoard.push('🩷');                      // 35% là heal/tim
        }

        const displayBoard = Array(20).fill('🎁');
        const userId = interaction.user.id;

        const createGameEmbed = (message = '') => {
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🎮 Domin Game')
                .setDescription(`${message}\n\nChọn một hộp quà để mở:`)
                .setFooter({ text: `Game của ${interaction.user.username}` });

            let boardDisplay = '';
            for (let i = 0; i < 20; i++) {
                boardDisplay += displayBoard[i] + ' ';
                if ((i + 1) % 5 === 0) boardDisplay += '\n';
            }

            embed.addFields({ name: 'Bảng Game', value: boardDisplay });
            return embed;
        };

        const createButtons = () => {
            const rows = [];
            for (let i = 0; i < 4; i++) {
                const row = new ActionRowBuilder();
                for (let j = 0; j < 5; j++) {
                    const index = i * 5 + j;
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`domin_${index}`)
                            .setLabel(`${index + 1}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(displayBoard[index] !== '🎁')
                    );
                }
                rows.push(row);
            }
            return rows;
        };

        const updateYuriCoin = (userId, amount) => {
            const filePath = path.join(__dirname, '../data/money.json');
            try {
                let moneyData = {};
                if (fs.existsSync(filePath)) {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    moneyData = JSON.parse(fileContent);
                }

                if (!moneyData[userId]) moneyData[userId] = 0;
                moneyData[userId] += amount;

                fs.writeFileSync(filePath, JSON.stringify(moneyData, null, 2));
                return moneyData[userId];
            } catch (error) {
                console.error('Lỗi khi cập nhật tiền:', error);
                return null;
            }
        };

        let coinsEarned = 0;

        const gameMessage = await interaction.reply({
            embeds: [createGameEmbed()],
            components: createButtons(),
            fetchReply: true
        });

        const collector = gameMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: 'Đây không phải lượt chơi của bạn!', ephemeral: true });
            }

            const index = parseInt(i.customId.split('_')[1]);
            const result = gameBoard[index];
            displayBoard[index] = result;

            let message = '';
            if (result === '💣') {
                message = `💥 Bạn đã mở phải bom! Trò chơi kết thúc!\n👉 Tổng coin kiếm được: **${coinsEarned}** 💸`;
                updateYuriCoin(userId, coinsEarned);
                collector.stop('hit_bomb');
            } else if (result === '💸') {
                coinsEarned += 10;
                message = `🎉 Bạn nhận được 10 Radiant Coins!\n👉 Tổng coin hiện tại: **${coinsEarned}** 💸`;
            } else {
                message = `💖 Bạn nhận được một trái tim! Tiếp tục nào!`;
            }

            await i.update({
                embeds: [createGameEmbed(message)],
                components: createButtons()
            });
        });

        collector.on('end', async (_, reason) => {
            if (reason !== 'hit_bomb') {
                updateYuriCoin(userId, coinsEarned);
                await interaction.editReply({
                    embeds: [createGameEmbed(`⏳ Trò chơi kết thúc do hết thời gian!\n👉 Tổng coin kiếm được: **${coinsEarned}** 💸`)],
                    components: []
                });
            }
        });
    }
};

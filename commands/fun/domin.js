const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('domin')
        .setDescription('Chơi game mở hộp quà với cơ hội nhận Radiant Coins),
    
        async execute(interaction) {
            
            const gameBoard = [];
            for (let i = 0; i < 20; i++) {
                
                const random = Math.random();
                if (random < 0.35) {
                    gameBoard.push('💣'); 
                } else if (random < 0.65) {
                    gameBoard.push('💸'); 
                } else {
                    gameBoard.push('🩷'); 
                }
            }
        
        const displayBoard = Array(20).fill('🎁');
        
       
        const userId = interaction.user.id;
        
      
        const createGameEmbed = (displayBoard, message = '') => {
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
            
            embed.addFields({ name: 'Bảng Game', value: boardDisplay, inline: false });
            return embed;
        };
        
       
        const createButtons = () => {
            const rows = [];
            
            for (let i = 0; i < 4; i++) {
                const row = new ActionRowBuilder();
                
                for (let j = 0; j < 5; j++) {
                    const index = i * 5 + j;
                    const button = new ButtonBuilder()
                        .setCustomId(`domin_${index}`)
                        .setLabel(`${index + 1}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(displayBoard[index] !== '🎁');
                    
                    row.addComponents(button);
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
                
          
                if (!moneyData[userId]) {
                    moneyData[userId] = 0;
                }
                moneyData[userId] += amount;
                
           
                fs.writeFileSync(filePath, JSON.stringify(moneyData, null, 2));
                
                return moneyData[userId];
            } catch (error) {
                console.error('Lỗi khi cập nhật tiền:', error);
                return null;
            }
        };

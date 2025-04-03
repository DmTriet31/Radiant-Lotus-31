const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bot gửi một tin nhắn embed')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Nội dung bạn muốn bot nói')
                .setRequired(true)),
                
    async execute(interaction) {
        const message = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Thông điệp từ bot:')
            .setDescription(message)
            .setFooter({ text: `Được gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
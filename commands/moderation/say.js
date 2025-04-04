const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một tin nhắn embed với chữ to')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Nội dung chính (sẽ hiển thị to hơn)')
                .setRequired(true)),

    async execute(interaction) {
        const message = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(message) // Tiêu đề sẽ hiển thị to
            .setFooter({ text: `Gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
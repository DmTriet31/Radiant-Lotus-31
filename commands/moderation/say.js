const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi một tin nhắn embed với tiêu đề và nội dung tùy chỉnh')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Tiêu đề của embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Nội dung bạn muốn bot nói')
                .setRequired(true)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(title)
            .setDescription(message)
            .setFooter({ text: `Gửi bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
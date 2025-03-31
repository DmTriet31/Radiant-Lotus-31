const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi tin nhắn có embed đến kênh được chọn.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Chọn kênh để gửi tin nhắn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Nội dung tin nhắn')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const messageContent = interaction.options.getString('message');

        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: '❌ Kênh không hợp lệ.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('📢 Thông báo từ quản trị viên')
            .setDescription(messageContent)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter({ text: `Gửi bởi ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: `✅ Đã gửi tin nhắn đến ${channel}`, ephemeral: true });
    },
};

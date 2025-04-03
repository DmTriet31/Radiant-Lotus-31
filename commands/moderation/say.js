const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Gửi một thông điệp dưới dạng Embed.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Tiêu đề của Embed')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Mô tả của Embed')
        .setRequired(true)),

  async execute(interaction) {
    // Lấy tiêu đề và mô tả từ người dùng nhập
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    // Tạo Embed
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('#3498db') // Màu xanh dương
      .setFooter({ text: `Được gửi bởi ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    // Gửi tin nhắn Embed vào kênh hiện tại
    await interaction.reply({ embeds: [embed] });
  },
};

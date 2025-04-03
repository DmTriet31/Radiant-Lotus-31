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
    // Lấy giá trị tiêu đề và mô tả từ các tham số người dùng nhập vào
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    // Tạo Embed
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('#00FF00')  // Bạn có thể thay đổi màu sắc ở đây
      .setTimestamp();

    // Gửi Embed vào kênh nơi lệnh được gọi
    await interaction.reply({ embeds: [embed] });
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('val') 
    .setDescription('Tăng rank cho người chơi')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Người nhận')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('points')
        .setDescription('Số điểm cộng')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Rank hiện tại')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const points = interaction.options.getInteger('points');
    const rank = interaction.options.getString('rank');

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: '[Room]', value: '#6 🎮\nRoblox', inline: true },
        { name: '[Slot]', value: '2/Unlimited', inline: true },
        { name: '[Rank]', value: rank.toUpperCase(), inline: true }
      )
      .setFooter({ text: 'Cách sử dụng: /val [rank] [msg]' }) // sửa lại cho đúng tên lệnh
      .setThumbnail('https://i.imgur.com/BmBbTDC.png');

    await interaction.reply({
      content: `${user} +${points}`,
      embeds: [embed]
    });
  }
};

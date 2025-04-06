const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('val')
    .setDescription('Tạo tin tuyển người chơi với rank cụ thể')
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Nội dung tin nhắn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank')
        .setRequired(true)
        .addChoices(
          { name: 'Radiant', value: 'Radiant' },
          { name: 'Immortal', value: 'Immortal' },
          { name: 'Ascendant', value: 'Ascendant' },
          { name: 'Diamond', value: 'Diamond' },
          { name: 'Platinum', value: 'Platinum' },
          { name: 'Gold', value: 'Gold' },
          { name: 'Silver', value: 'Silver' },
          { name: 'Bronze', value: 'Bronze' },
          { name: 'Iron', value: 'Iron' },
          { name: 'Unrated', value: 'Unrated' },
          { name: 'Spikerush', value: 'Spikerush' },
        )),
  
  async execute(interaction) {
    const msg = interaction.options.getString('msg');
    const rank = interaction.options.getString('rank');

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setTitle(`@${interaction.user.username} ${msg}`)
      .addFields(
        { name: 'Room', value: '#6 🎮 Roblox', inline: true },
        { name: 'Slot', value: '2/Unlimited', inline: true },
        { name: 'Rank', value: rank.toUpperCase(), inline: true },
      )
      .setFooter({ text: 'Cách sử dụng: /cyp [rank] [msg]' })
      .setThumbnail('https://i.imgur.com/VXSLhI0.png'); // bạn có thể thay bằng icon rank

    await interaction.reply({ content: `@${interaction.user} ${msg}`, embeds: [embed] });
  }
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const rankChoices = [
  'Radiant', 'Immortal', 'Ascendant', 'Diamond',
  'Platinum', 'Gold', 'Silver', 'Bronze',
  'Iron', 'Unrated', 'Spikerush'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('val')
    .setDescription('Tạo tin tuyển người chơi với rank cụ thể')
    // Đưa phần RANK lên trước
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank')
        .setRequired(true)
        .addChoices(...rankChoices.map(rank => ({ name: rank, value: rank }))))
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Nội dung tin nhắn')
        .setRequired(true)),
  
  async execute(interaction) {
    const msg = interaction.options.getString('msg');
    const rank = interaction.options.getString('rank');
    const member = interaction.member;

    const voiceChannel = member.voice?.channel;
    const roomName = voiceChannel ? voiceChannel.name : '❌ Không ở trong voice channel';

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setAuthor({ name: `${interaction.user.username} ${msg}`, iconURL: interaction.user.displayAvatarURL() })
      .addFields(
        { name: 'Room', value: roomName, inline: true },
        { name: 'Slot', value: '2/Unlimited', inline: true },
        { name: 'Rank', value: rank.toUpperCase(), inline: true },
      )
      .setFooter({ text: 'Cách sử dụng: /cyp rank: [rank] msg: [msg]' });

    await interaction.reply({ content: `@${interaction.user} ${msg}`, embeds: [embed] });
  }
};

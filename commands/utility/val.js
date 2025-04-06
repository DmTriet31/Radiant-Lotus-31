const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const rankChoices = [
  'Radiant', 'Immortal', 'Ascendant', 'Diamond',
  'Platinum', 'Gold', 'Silver', 'Bronze',
  'Iron', 'Unrated', 'Spikerush'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('val')
    .setDescription('Tạo tin tuyển người chơi với rank cụ thể')
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank')
        .setRequired(true)
        .addChoices(...rankChoices.map(rank => ({ name: rank, value: rank })))),
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

    // Xử lý msg để tìm giá trị số lượng người chơi
    const slotMatch = msg.match(/([+-]?\d+)(?:-([+-]?\d+))?/); // Phù hợp với +X, X, hoặc +X-Y
    let slotValue = '2/Unlimited'; // Mặc định là 2/Unlimited

    if (slotMatch) {
      const start = slotMatch[1]; // Số bắt đầu (ví dụ: +1)
      const end = slotMatch[2];   // Số kết thúc (nếu có, ví dụ: -5)
      
      if (end) {
        slotValue = `${start}-${end}/Unlimited`;
      } else {
        slotValue = `${start}/Unlimited`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        { name: 'Room', value: roomName, inline: true },
        { name: 'Slot', value: slotValue, inline: true },
        { name: 'Rank', value: rank.toUpperCase(), inline: true }
      )
      .setFooter({ text: 'Cách sử dụng: /val rank: [rank] msg: [msg]' });

    const joinButton = new ButtonBuilder()
      .setCustomId(JSON.stringify({ cmd: 'join_voice', vc: voiceChannel?.id || null }))
      .setLabel('🔊 Join Voice')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!voiceChannel);

    const row = new ActionRowBuilder().addComponents(joinButton);

    await interaction.reply({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [row]
    });
  }
};

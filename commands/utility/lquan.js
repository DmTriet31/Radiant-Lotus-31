const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const rankChoices = [
  'Chiến tướng', 'Cao thủ', 'Tinh anh', 'Kim cương',
  'Bạch kim', 'Vàng', 'Bạc', 'Đồng',
  'Không rank', 'Đấu thường'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lquan')
    .setDescription('Tạo tin tuyển người chơi Liên Quân với rank cụ thể')
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank')
        .setRequired(true)
        .addChoices(...rankChoices.map(rank => ({ name: rank, value: rank })))
    )
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Nội dung tin nhắn')
        .setRequired(true)
    ),

  async execute(interaction) {
    const msg = interaction.options.getString('msg');
    const rank = interaction.options.getString('rank');
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;

    // Xử lý phòng và slot
    let roomName = '❌ Không ở trong voice channel';
    let slot = '0/0';

    if (voiceChannel) {
      const memberCount = voiceChannel.members.size;
      const userLimit = voiceChannel.userLimit;
      slot = `${memberCount}/${userLimit === 0 ? 'Unlimited' : userLimit}`;
      roomName = voiceChannel.name;
    }

    const embed = new EmbedBuilder()
      .setColor(0x00AAFF)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        { name: 'Phòng', value: roomName, inline: true },
        { name: 'Slot', value: slot, inline: true },
        { name: 'Rank', value: rank.toUpperCase(), inline: true }
      )
      .setFooter({ text: 'Cách sử dụng: /lquan rank: [rank] msg: [msg]' });

    const joinButton = new ButtonBuilder()
      .setCustomId(JSON.stringify({ cmd: 'join_voice', vc: voiceChannel?.id || null }))
      .setLabel('🔊 Tham gia voice')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!voiceChannel);

    const row = new ActionRowBuilder().addComponents(joinButton);

    await interaction.reply({
      content: `${interaction.user} ${msg}`,
      embeds: [embed],
      components: [row]
    });
  }
};
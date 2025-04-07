const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const rankChoices = [
  'Thách đấu', 'Cao thủ', 'Đại cao thủ', 'Kim cương',
  'Bạch kim', 'Vàng', 'Bạc', 'Đồng', 'Sắt',
  'Chưa xếp hạng'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tft')
    .setDescription('Tạo tin tuyển người chơi Đấu Trường Chân Lý (TFT)')
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank TFT')
        .setRequired(true)
        .addChoices(...rankChoices.map(rank => ({ name: rank, value: rank })))
    )
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Nội dung tin nhắn tuyển')
        .setRequired(true)
    ),

  async execute(interaction) {
    const msg = interaction.options.getString('msg');
    const rank = interaction.options.getString('rank');
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;
    const roomName = voiceChannel ? voiceChannel.name : '❌ Không ở trong voice channel';

    const embed = new EmbedBuilder()
      .setColor(0x9147FF)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        { name: 'Phòng voice', value: roomName, inline: true },
        { name: 'Slot', value: '2/Không giới hạn', inline: true },
        { name: 'Rank', value: rank, inline: true }
      )
      .setFooter({ text: 'Sử dụng: /tft rank: [rank] msg: [nội dung tuyển]' });

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

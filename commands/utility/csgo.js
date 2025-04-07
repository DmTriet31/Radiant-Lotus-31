const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const rankChoices = [
  'Global Elite', 'Supreme Master', 'Legendary Eagle Master',
  'Legendary Eagle', 'Distinguished Master Guardian',
  'Master Guardian', 'Gold Nova', 'Silver',
  'Chưa xếp hạng', 'Chơi thường'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('csgo')
    .setDescription('Tạo tin tuyển người chơi CS:GO')
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank CS:GO')
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

    let roomName = '❌ Không ở trong voice channel';
    let slot = '0/0';

    if (voiceChannel) {
      const memberCount = voiceChannel.members.size;
      const userLimit = voiceChannel.userLimit;
      slot = `${memberCount}/${userLimit === 0 ? 'Không giới hạn' : userLimit}`;
      roomName = voiceChannel.name;
    }

    const embed = new EmbedBuilder()
      .setColor(0x4B92DB)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        { name: 'Phòng voice', value: roomName, inline: true },
        { name: 'Slot', value: slot, inline: true },
        { name: 'Rank', value: rank, inline: true }
      )
      .setFooter({ text: 'Sử dụng: /csgo rank: [rank] msg: [nội dung tuyển]' });

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
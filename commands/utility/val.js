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

    let roomName = '❌ Không ở trong voice channel';
    let slot = '0/0';
    let row = null;
    let invite = null;

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setAuthor({
        name: `${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL()
      })
      .setFooter({ text: 'Cách sử dụng: /val rank: [rank] msg: [msg]' });

    if (voiceChannel) {
      const memberCount = voiceChannel.members.size;
      const userLimit = voiceChannel.userLimit;
      slot = `${memberCount}/${userLimit === 0 ? 'Unlimited' : userLimit}`;
      roomName = voiceChannel.name;

      // Tạo invite tạm thời
      invite = await voiceChannel.createInvite({
        maxAge: 300, // Hết hạn sau 5 phút
        maxUses: 1,  // Dùng 1 lần
        temporary: true
      });

      const joinButton = new ButtonBuilder()
        .setLabel(`🔊 Tham gia: ${voiceChannel.name}`)
        .setStyle(ButtonStyle.Link)
        .setURL(invite.url);

      row = new ActionRowBuilder().addComponents(joinButton);
    }

    // Thêm các field vào embed với format mới
    embed.addFields(
      { name: '\u200B', value: `> [Room] ${roomName}` },
      { name: '\u200B', value: `> [Slot] ${slot}` },
      { name: '\u200B', value: `> [Rank] ${rank.toUpperCase()}` }
    );

    if (voiceChannel) {
      embed.addFields(
        { name: '\u200B', value: `> [Voicechat] ${voiceChannel.name}` }
      );
    }

    await interaction.reply({
      content: `${interaction.user} ${msg}`,
      embeds: [embed],
      components: row ? [row] : []
    });

    // Hủy invite khi người dùng rời voice
    const filter = (oldState, newState) =>
      newState.member.id === interaction.user.id &&
      oldState.channelId === voiceChannel?.id &&
      !newState.channelId;

    interaction.client.on('voiceStateUpdate', async (oldState, newState) => {
      if (filter(oldState, newState) && invite) {
        try {
          await invite.delete();
          console.log('Đã hủy invite vì người dùng rời kênh voice.');
        } catch (e) {
          console.error('Lỗi khi xóa invite:', e);
        }
      }
    });
  }
};
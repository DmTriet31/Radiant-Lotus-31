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

    // Tìm số lượng người chơi (bao gồm cả giá trị +X)
    const playerCountMatch = msg.match(/([+-]?\d+)/);
    const playerCount = playerCountMatch ? parseInt(playerCountMatch[1]) : 2;  // Mặc định là 2 nếu không có số lượng người chơi

    // Cập nhật Slot tùy theo số lượng người chơi
    const slotValue = `${playerCount}/Unlimited`;

    const embed = new EmbedBuilder()
      .setColor(0xAA00FF)
      .setAuthor({
        name: `${interaction.user.username}`,  // Chỉ hiển thị tên người dùng mà không có thêm message
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

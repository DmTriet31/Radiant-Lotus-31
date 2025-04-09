const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const gameRanks = {
  lienquan: ['Chiến tướng', 'Cao thủ', 'Tinh anh', 'Kim cương', 'Bạch kim', 'Vàng', 'Bạc', 'Đồng', 'Không rank', 'Đấu thường'],
  freefire: ['Thách đấu', 'Huyền thoại', 'Tinh nhuệ', 'Kim cương', 'Bạch kim', 'Vàng', 'Bạc', 'Đồng', 'Không rank', 'Chế độ thường'],
  pubg: ['Thống lĩnh', 'Tối thượng', 'Kim cương', 'Bạch kim', 'Vàng', 'Bạc', 'Đồng', 'Không rank', 'Classic'],
  val: ['Radiant', 'Immortal', 'Ascendant', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron', 'Unranked'],
  csgo: ['Global Elite', 'Supreme Master', 'Legendary Eagle Master', 'Legendary Eagle', 'Distinguished Master Guardian', 'Master Guardian', 'Gold Nova', 'Silver', 'Chưa xếp hạng', 'Chơi thường'],
  tft: ['Thách đấu', 'Cao thủ', 'Đại cao thủ', 'Kim cương', 'Bạch kim', 'Vàng', 'Bạc', 'Đồng', 'Sắt', 'Chưa xếp hạng'],
  roblox: ['Chuyên gia Simulator', 'Master Obby', 'Vua Roleplay', 'Tryhard FPS', 'Đại gia Tycoon', 'Không phân loại']
};

const allRanks = [...new Set(Object.values(gameRanks).flat())];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Tạo tin tuyển người chơi cho nhiều tựa game')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('Chọn game muốn tuyển')
        .setRequired(true)
        .addChoices(
          { name: 'Liên Quân', value: 'lienquan' },
          { name: 'Free Fire', value: 'freefire' },
          { name: 'PUBG', value: 'pubg' },
          { name: 'Valorant', value: 'val' },
          { name: 'CS:GO', value: 'csgo' },
          { name: 'Đấu Trường Chân Lý', value: 'tft' },
          { name: 'Roblox', value: 'roblox' }
        )
    )
    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Chọn rank phù hợp với game')
        .setRequired(true)
        .addChoices(...allRanks.map(rank => ({ name: rank, value: rank })))
    )
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Nội dung tin nhắn tuyển người')
        .setRequired(true)
    ),

  async execute(interaction) {
    const game = interaction.options.getString('game');
    const rank = interaction.options.getString('rank');
    const msg = interaction.options.getString('msg');
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;

    const validRanks = gameRanks[game];
    if (!validRanks.includes(rank)) {
      return await interaction.reply({
        content: `❌ Rank **${rank}** không hợp lệ cho game **${game}**`,
        ephemeral: true
      });
    }

    let roomName = '❌ Không ở trong voice channel';
    let slot = '0/0';

    if (voiceChannel) {
      const memberCount = voiceChannel.members.size;
      const userLimit = voiceChannel.userLimit;
      slot = `${memberCount}/${userLimit === 0 ? 'Không giới hạn' : userLimit}`;
      roomName = voiceChannel.name;
    }

    const colors = {
      lienquan: 0x00AAFF,
      freefire: 0xFF4500,
      pubg: 0xDAA520,
      val: 0xFF2D55,
      csgo: 0x4B92DB,
      tft: 0x9147FF,
      roblox: 0xFFD700
    };

    const embed = new EmbedBuilder()
      .setColor(colors[game] || 0x2F3136)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        { name: 'Game', value: game.toUpperCase(), inline: true },
        { name: 'Phòng voice', value: roomName, inline: true },
        { name: 'Slot', value: slot, inline: true },
        { name: 'Rank', value: rank, inline: true }
      )
      .setFooter({ text: `Sử dụng: /game game: [game] rank: [rank] msg: [nội dung]` });

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

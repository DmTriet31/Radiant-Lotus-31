const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const activityChoices = [
  'PvE', 'PvP', 'Cày cuốc', 'Guild Wars', 'Đánh Boss', 'Khác'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('albion')
    .setDescription('Tạo cuộc mời tìm đồng đội trong Albion Online')
    .addStringOption(option =>
      option.setName('activity')
        .setDescription('Chọn hoạt động trong Albion Online')
        .setRequired(true)
        .addChoices(...activityChoices.map(activity => ({ name: activity, value: activity })))
    )
    .addStringOption(option =>
      option.setName('character')
        .setDescription('Tên nhân vật trong Albion Online')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const activity = interaction.options.getString('activity');
    const character = interaction.options.getString('character');
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;
    const roomName = voiceChannel ? voiceChannel.name : '❌ Không ở trong voice channel';

    // Tạo thông tin cuộc mời
    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setTitle(`⚔️ **Tìm Đồng Đội trong Albion Online**`)
      .setDescription(`**Nhân vật**: ${character}\n**Hoạt động**: ${activity}`)
      .addFields(
        { name: 'Phòng voice', value: roomName, inline: true },
        { name: 'Số người tham gia', value: '1/Không giới hạn', inline: true }
      )
      .setFooter({ text: 'Sử dụng: /albion activity: [hoạt động] character: [tên nhân vật]' });

    // Nút tham gia voice channel
    const joinButton = new ButtonBuilder()
      .setCustomId(JSON.stringify({ cmd: 'join_voice', vc: voiceChannel?.id || null }))
      .setLabel('🔊 Tham gia Voice')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!voiceChannel);

    const row = new ActionRowBuilder().addComponents(joinButton);

    await interaction.reply({
      content: `${interaction.user} đang tìm đồng đội trong Albion Online!`,
      embeds: [embed],
      components: [row]
    });
  }
};

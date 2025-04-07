const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const genreChoices = [
  'Hành động', 'Kinh dị', 'Lãng mạn', 'Hài hước', 
  'Khoa học viễn tưởng', 'Hoạt hình', 'Phim tài liệu', 'Chưa chọn'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('votephim')
    .setDescription('Tạo cuộc bầu chọn cho thể loại phim và tên phim')
    .addStringOption(option =>
      option.setName('genre')
        .setDescription('Chọn thể loại phim')
        .setRequired(true)
        .addChoices(...genreChoices.map(genre => ({ name: genre, value: genre })))
    )
    .addStringOption(option =>
      option.setName('movie')
        .setDescription('Tên phim')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('date')
        .setDescription('Ngày tháng xem phim (VD: 20/04/2025)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const genre = interaction.options.getString('genre');
    const movie = interaction.options.getString('movie');
    const date = interaction.options.getString('date');
    const member = interaction.member;

    const embed = new EmbedBuilder()
      .setColor(0xFF6347)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTitle('Cuộc Bầu Chọn Phim Xem Cùng!')
      .setDescription(`**Thể loại phim**: ${genre}\n**Tên phim**: ${movie}\n**Ngày xem**: ${date}`)
      .setFooter({ text: 'Hãy tham gia vote để chọn phim xem!' });

    const voteButton = new ButtonBuilder()
      .setCustomId('vote_yes')
      .setLabel('👍 Thích Phim')
      .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
      .setCustomId('vote_no')
      .setLabel('👎 Không Thích Phim')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(voteButton, declineButton);

    await interaction.reply({
      content: `${interaction.user} đã tạo một cuộc bầu chọn phim!`,
      embeds: [embed],
      components: [row]
    });
  }
};

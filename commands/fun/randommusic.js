// commands/fun/randommusic.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const songs = [
  "Sơn Tùng M-TP - Hãy Trao Cho Anh",
  "Sơn Tùng M-TP - Lạc Trôi",
  "Đen Vâu - Trốn Tìm",
  "Đen Vâu - Mang Tiền Về Cho Mẹ",
  "Hoàng Thùy Linh - See Tình",
  "Hoàng Thùy Linh - Để Mị Nói Cho Mà Nghe",
  "Bích Phương - Bùa Yêu",
  "Bích Phương - Một Cú Lừa",
  "JustaTee x Phương Ly - Thằng Điên",
  "Phương Ly - Missing You",
  "MONO - Waiting For You",
  "MONO - Em Là",
  "Vũ. - Bước Qua Mùa Cô Đơn",
  "Vũ. - Đông Kiếm Em",
  "ERIK - Chạy Về Khóc Với Anh",
  "ERIK - Sau Tất Cả",
  "AMEE - Anh Nhà Ở Đâu Thế",
  "AMEE - Yêu Thì Yêu Không Yêu Thì Yêu",
  "Tóc Tiên - Có Ai Thương Em Như Anh",
  "MIN - Trên Tình Bạn Dưới Tình Yêu",
  "MIN - Có Em Chờ",
  "Mr. Siro - Không Thể Cùng Nhau Suốt Kiếp",
  "Hòa Minzy - Không Thể Cùng Nhau Suốt Kiếp",
  "OnlyC x Karik - Yêu Đơn Phương",
  "Obito - Simple Love",
  "Wxrdie - Gái Việt",
  "Rhymastic - Yêu 5",
  "Soobin - Tháng Năm",
  "Soobin x Binz - BlackJack",
  "Binz - OK",
  "Binz - BigCityBoi"
];

const advices = [
  "Hôm nay hãy nghỉ ngơi một chút, bạn xứng đáng điều đó.",
  "Cuộc sống ngắn lắm, nghe nhạc chill một tí rồi làm tiếp!",
  "Một bài hát hay có thể chữa lành tâm hồn đấy nhé!",
  "Đừng để deadline giết chết tinh thần, bật nhạc lên nào!",
  "Tâm trạng thế nào không quan trọng, quan trọng là có nhạc Việt đồng hành!",
  "Bạn làm tốt lắm, đừng quên tự thưởng cho mình bằng một giai điệu hay."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randommusic")
    .setDescription("🎶 Gợi ý một bài nhạc Việt kèm một lời khuyên cho bạn."),
  async execute(interaction) {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];

    const embed = new EmbedBuilder()
      .setColor('#e91e63')
      .setTitle('🎶 Gợi Ý Nhạc Việt')
      .setDescription(`**Bài hát bạn nên nghe:**\n${randomSong}`)
      .addFields(
        { name: '💡 Lời khuyên', value: randomAdvice }
      )
      .setThumbnail('https://cdn-icons-png.flaticon.com/512/727/727245.png') // Có thể thay đổi thành hình ảnh bạn thích
      .setTimestamp()
      .setFooter({ text: 'Music Bot • Việt Nam Vibes', iconURL: 'https://cdn-icons-png.flaticon.com/512/727/727245.png' });

    await interaction.reply({ embeds: [embed] });
  },
};

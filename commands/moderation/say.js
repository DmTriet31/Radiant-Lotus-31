const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/say')) {
    // Tách lệnh và các tham số
    const args = message.content.slice(5).trim().split(';');
    const title = args[0] || 'Tiêu đề mặc định';
    const description = args[1] || 'Mô tả mặc định';

    // Tạo Embed
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('#00FF00') // Bạn có thể thay đổi màu sắc ở đây
      .setTimestamp();

    // Gửi embed
    message.channel.send({ embeds: [embed] });
  }
});

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

    // Xử lý tên phòng và slot
    let roomName = '❌ Không ở trong voice channel';
    let slot = '0/0';

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

      const vcLink = `https://discord.com/channels/${interaction.guild.id}/${voiceChannel.id}`;
      embed.addFields({ name: 'Voice Channel', value: `[Join VC](${vcLink})`, inline: false });
    }

    embed.addFields(
      { name: 'Room', value: roomName, inline: true },
      { name: 'Slot', value: slot, inline: true },
      { name: 'Rank', value: rank.toUpperCase(), inline: true }
    );

    const joinButton = new ButtonBuilder()
      .setCustomId(JSON.stringify({ cmd: 'join_voice', vc: voiceChannel?.id || null }))
      .setLabel('Mở kênh voice')
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
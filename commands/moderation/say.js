const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Gửi một embed với tiêu đề và mô tả')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Tiêu đề của embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Nội dung mô tả trong embed')
        .setRequired(true)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    const embed = new EmbedBuilder()
      .setColor(0x6A0DAD)
      .setTitle(title)
      .setDescription(description)
      .setFooter({
        text: `Gửi bởi ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Gửi một embed')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Tiêu đề embed')
        .setRequired(true)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');

    const embed = new EmbedBuilder()
      .setColor('#6A0DAD') // Tím đậm
      .setTitle(title)
      .setFooter({ 
        text: `Gửi bởi ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL() 
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

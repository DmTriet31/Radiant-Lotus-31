/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/


const { serverConfigCollection } = require('../../mongodb'); 
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { commandLogsCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcommandlogs')
    .setDescription('Manage command logging configuration.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    // Subcommand: set
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Enable or disable command logging.')
        .addBooleanOption(option =>
          option
            .setName('enabled')
            .setDescription('Set to true to enable logging, false to disable.')
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to send command execution logs (required when enabling).')
            .setRequired(false)
        )
    )
    // Subcommand: view
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View the current command logging configuration.')
    ),
  async execute(interaction) {
    // Ensure the interaction is a command
    if (interaction.isCommand && interaction.isCommand()) {

    const subcommand = interaction.options.getSubcommand();
    const { guild } = interaction;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server.', flags: 64 });
    }
    const guildId = guild.id;

    // If using the "set" subcommand
    if (subcommand === 'set') {
      const guild = interaction.guild;
      const serverId = interaction.guild.id;
      const configMangerData = await serverConfigCollection.findOne({ serverId });
      const botManagers = configMangerData ? configMangerData.botManagers || [] : [];

      if (!botManagers.includes(interaction.user.id) && interaction.user.id !== guild.ownerId) {
          return interaction.reply({ 
              content: '❌ Only the **server owner** or **bot managers** can use this command.', 
              flags: 64
          });
      }
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('You do not have permission to use this command.');
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('channel');

      if (enabled) {
        // When enabling, a channel must be provided
        if (!channel) {
          return interaction.reply({ content: 'Please provide a channel when enabling command logging.', flags: 64 });
        }
        // Ensure the provided channel is text-based
        if (!channel.isTextBased()) {
          return interaction.reply({ content: 'Please select a text-based channel.', flags: 64 });
        }

        // Upsert a configuration document: logging enabled, channel provided
        await commandLogsCollection.updateOne(
          { guildId, isConfig: true },
          { $set: { channelId: channel.id, enabled: true, isConfig: true } },
          { upsert: true }
        );

        return interaction.reply({
          content: `Command execution logs have been **enabled** and will now be sent to <#${channel.id}>.`,
          flags: 64,
        });
      } else {
        // When disabling logging, update (or create) the config to mark logging as disabled.
        await commandLogsCollection.updateOne(
          { guildId, isConfig: true },
          { $set: { enabled: false, isConfig: true } },
          { upsert: true }
        );

        return interaction.reply({
          content: 'Command execution logging has been **disabled** for this server.',
          flags: 64,
        });
      }
    }

    // If using the "view" subcommand
    else if (subcommand === 'view') {
      const guild = interaction.guild;
      const serverId = interaction.guild.id;
      const configMangerData = await serverConfigCollection.findOne({ serverId });
      const botManagers = configMangerData ? configMangerData.botManagers || [] : [];

      if (!botManagers.includes(interaction.user.id) && interaction.user.id !== guild.ownerId) {
          return interaction.reply({ 
              content: '❌ Only the **server owner** or **bot managers** can use this command.', 
              flags: 64
          });
      }
      const config = await commandLogsCollection.findOne({ guildId, isConfig: true });
      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('Command Logging Configuration')
        .setTimestamp();

      if (!config || config.enabled === false) {
        embed.setDescription('Command logging is currently **disabled** for this server.');
      } else {
        embed.setDescription('Command logging is **enabled** for this server.')
          .addFields(
            { name: 'Log Channel', value: `<#${config.channelId}>`, inline: true },
            { name: 'Status', value: 'Enabled', inline: true }
          );
      }

      return interaction.reply({ embeds: [embed], flags: 64 });
    }
  } else {
    // If not used as a slash command, alert the user.
    const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash commands!\n- Please use `/setcommandlogs`')
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
  },
};

/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/

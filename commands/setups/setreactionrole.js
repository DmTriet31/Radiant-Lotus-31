const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');
const { reactionRolesCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
const { serverConfigCollection } = require('../../mongodb'); 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreactionrole')
    .setDescription('Set up or view a reaction role message')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    // Subcommand to set up a reaction role message
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('Set up a reaction role message')
        .addStringOption(option =>
          option.setName('title')
            .setDescription('The title of the embed')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('description')
            .setDescription('The description of the embed')
            .setRequired(true))
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to send the reaction role message in')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('role1')
            .setDescription('The first role ID')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('label1')
            .setDescription('The first button label')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('role2')
            .setDescription('The second role ID')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('label2')
            .setDescription('The second button label')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('role3')
            .setDescription('The third role ID')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('label3')
            .setDescription('The third button label')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('role4')
            .setDescription('The fourth role ID')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('label4')
            .setDescription('The fourth button label')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('role5')
            .setDescription('The fifth role ID')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('label5')
            .setDescription('The fifth button label')
            .setRequired(false))
    )
    // Subcommand to view the current reaction role setups for this server.
    .addSubcommand(sub =>
      sub
        .setName('view')
        .setDescription('View reaction role setups for this server')
    ),

  async execute(interaction) {
    if (interaction.isCommand && interaction.isCommand()) {
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
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'set') {
        // ========= SET SUBCOMMAND =========
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
          const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('You do not have permission to use this command.');
          return interaction.reply({ embeds: [embed], flags: 64 });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const channel = interaction.options.getChannel('channel');

        const roles = [];
        const labels = [];
        const customIds = [];

        // Loop through potential five roles/labels.
        for (let i = 1; i <= 5; i++) {
          const role = interaction.options.getString(`role${i}`);
          const label = interaction.options.getString(`label${i}`);
          if (role && label) {
            roles.push(role);
            labels.push(label);
            customIds.push(`reaction_role_${channel.id}_${i}`);
          }
        }

        if (roles.length === 0) {
          return interaction.reply({ content: 'You must provide at least one role and label.', flags: 64 });
        }

        // Build the reaction role embed description
        const embedDescription = roles.map((role, i) => `${labels[i]} - <@&${role}>`).join('\n');
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(`${description}\n\n${embedDescription}`)
          .setColor('#FF00FF');

        // Create buttons for each role.
        const buttons = roles.map((role, i) =>
          new ButtonBuilder()
            .setCustomId(customIds[i])
            .setLabel(labels[i])
            .setStyle(ButtonStyle.Primary)
        );

        const row = new ActionRowBuilder().addComponents(buttons);

        // Send the embed message in the selected channel.
        const message = await channel.send({ embeds: [embed], components: [row] });

        // Save each reaction role configuration to your collection.
        for (let i = 0; i < roles.length; i++) {
          const roleId = roles[i];
          const customId = customIds[i];
          const label = labels[i];

          await reactionRolesCollection.insertOne({
            channelId: channel.id,
            messageId: message.id,
            roleId,
            customId,
            label,
            style: ButtonStyle.Primary
          });
        }

        return interaction.reply({ content: 'Reaction role message set up!', flags: 64 });

      } else if (subcommand === 'view') {
        // ========= VIEW SUBCOMMAND =========
        const guild = interaction.guild;
        // Fetch all reaction role configurations from your collection.
        const allReactionRoles = await reactionRolesCollection.find({}).toArray();
        // Filter to only those that belong to channels in this guild.
        const filtered = allReactionRoles.filter(rr => guild.channels.cache.has(rr.channelId));

        if (filtered.length === 0) {
          return interaction.reply({ content: 'No reaction role setups found for this server.', flags: 64 });
        }

        // Group reaction roles by channel.
        const grouped = {};
        for (const rr of filtered) {
          if (!grouped[rr.channelId]) grouped[rr.channelId] = [];
          grouped[rr.channelId].push(rr);
        }

        // Build an array of embeds (one per channel grouping).
        const embeds = [];
        for (const channelId in grouped) {
          const channel = guild.channels.cache.get(channelId);
          let description = `**Channel:** <#${channelId}>\n`;
          const entries = grouped[channelId];
          for (const entry of entries) {
            description += `**Message ID:** ${entry.messageId}\n`;
            description += `**Role:** <@&${entry.roleId}> | **Label:** ${entry.label}\n`;
            description += `**Custom ID:** ${entry.customId}\n\n`;
          }

          // If the description is too long (beyond Discord's limit), split into multiple embeds.
          if (description.length > 2048) {
            let chunk = '';
            const lines = description.split('\n');
            for (const line of lines) {
              if ((chunk + line + '\n').length > 2048) {
                embeds.push(new EmbedBuilder().setColor('#FF00FF').setTitle('Reaction Role Setup').setDescription(chunk));
                chunk = line + '\n';
              } else {
                chunk += line + '\n';
              }
            }
            if (chunk) {
              embeds.push(new EmbedBuilder().setColor('#FF00FF').setTitle('Reaction Role Setup').setDescription(chunk));
            }
          } else {
            embeds.push(new EmbedBuilder().setColor('#FF00FF').setTitle('Reaction Role Setup').setDescription(description));
          }
        }

        return interaction.reply({ embeds, flags: 64 });
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({
          name: "Alert!",
          iconURL: cmdIcons.dotIcon,
          url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash commands!\n- Please use `/setreactionrole`')
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }
  }
};

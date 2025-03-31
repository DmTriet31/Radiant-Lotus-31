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


const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Manage saved embeds and announcements.')

        // Save Embed
        .addSubcommand(subcommand =>
            subcommand
                .setName('save')
                .setDescription('Save an embed for later use.')
                .addStringOption(option => option.setName('name').setDescription('Unique embed name.').setRequired(true))
                .addStringOption(option => option.setName('color').setDescription('Hex color (e.g., #ff5733).').setRequired(false))
                .addStringOption(option => option.setName('title').setDescription('Embed title.').setRequired(false))
                .addStringOption(option => option.setName('url').setDescription('Title URL.').setRequired(false))
                .addStringOption(option => option.setName('author_name').setDescription('Author name.').setRequired(false))
                .addStringOption(option => option.setName('author_icon').setDescription('Author icon URL.').setRequired(false))
                .addStringOption(option => option.setName('author_url').setDescription('Author URL.').setRequired(false))
                .addStringOption(option => option.setName('description').setDescription('Embed description.').setRequired(false))
                .addStringOption(option => option.setName('thumbnail').setDescription('Thumbnail URL.').setRequired(false))
                .addStringOption(option => option.setName('fields').setDescription('Fields (JSON format: [{"name":"Name","value":"Value"}]).').setRequired(false))
                .addStringOption(option => option.setName('image').setDescription('Image URL.').setRequired(false))
                .addBooleanOption(option => option.setName('timestamp').setDescription('Include timestamp?').setRequired(false))
                .addStringOption(option => option.setName('footer_text').setDescription('Footer text.').setRequired(false))
                .addStringOption(option => option.setName('footer_icon').setDescription('Footer icon URL.').setRequired(false)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a saved embed.')
                .addStringOption(option => option.setName('name').setDescription('Saved embed name.').setRequired(true)))

        // View Saved Embeds
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View saved embeds.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the saved embed to view (leave empty to see all names).')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('announce')
                .setDescription('Send an announcement with a saved or new embed.')
                .addChannelOption(option => option.setName('channel').setDescription('Channel to send the embed.').setRequired(true))
                .addStringOption(option => option.setName('embed_name').setDescription('Saved embed name (leave empty for new).').setRequired(false))
                .addStringOption(option => option.setName('title').setDescription('Embed title.').setRequired(false))
                .addStringOption(option => option.setName('description').setDescription('Embed description.').setRequired(false))
                .addStringOption(option => option.setName('color').setDescription('Hex color (e.g., #ff5733).').setRequired(false))
                .addStringOption(option => option.setName('image').setDescription('Image URL.').setRequired(false))
                .addStringOption(option => option.setName('thumbnail').setDescription('Thumbnail URL.').setRequired(false))
                .addStringOption(option => option.setName('footer_text').setDescription('Footer text.').setRequired(false))
                .addStringOption(option => option.setName('footer_icon').setDescription('Footer icon URL.').setRequired(false))
                .addRoleOption(option => option.setName('mention_role').setDescription('Role to mention.').setRequired(false))
                .addStringOption(option => option.setName('non_embed_content').setDescription('Text before the embed.').setRequired(false))
                .addIntegerOption(option => option.setName('timer').setDescription('Delay in seconds before sending.').setRequired(false))),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({ content: '🚫 You lack permission to use this command.', ephemeral: true });
            }

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'save') {
                const name = interaction.options.getString('name').toLowerCase();
                let fields = interaction.options.getString('fields');

                // Validate JSON fields
                try {
                    fields = fields ? JSON.parse(fields) : [];
                    if (!Array.isArray(fields)) throw new Error();
                } catch {
                    return interaction.reply({ content: '❌ Invalid fields format. Use JSON like `[{"name":"Field","value":"Value"}]`.', ephemeral: true });
                }

                // Validate Hex Color
                const color = interaction.options.getString('color');
                if (color && !/^#([0-9A-F]{6})$/i.test(color)) {
                    return interaction.reply({ content: '❌ Invalid color format. Use HEX (e.g., `#ff5733`).', ephemeral: true });
                }

                // Validate URLs
                const urlFields = ['author_icon', 'author_url', 'footer_icon', 'image', 'thumbnail'];
                for (const field of urlFields) {
                    const value = interaction.options.getString(field);
                    if (value && !/^https?:\/\//.test(value)) {
                        return interaction.reply({ content: `❌ Invalid URL in **${field}**. Ensure it starts with \`http://\` or \`https://\`.`, ephemeral: true });
                    }
                }

                // Construct embed data with null defaults
                const embedData = {
                    color: color || null,
                    title: interaction.options.getString('title') || null,
                    url: interaction.options.getString('url') || null,
                    author: {
                        name: interaction.options.getString('author_name') || null,
                        icon: interaction.options.getString('author_icon') || null,
                        url: interaction.options.getString('author_url') || null
                    },
                    description: interaction.options.getString('description') || null,
                    thumbnail: interaction.options.getString('thumbnail') || null,
                    fields: fields || [],
                    image: interaction.options.getString('image') || null,
                    footer: {
                        text: interaction.options.getString('footer_text') || null,
                        icon: interaction.options.getString('footer_icon') || null
                    },
                    timestamp: interaction.options.getBoolean('timestamp') || null
                };

                await embedCollection.updateOne({ name }, { $set: embedData }, { upsert: true });
                return interaction.reply({ content: `✅ Embed **${name}** has been saved!`, ephemeral: true });

            }
            if (subcommand === 'view') {
                const embedName = interaction.options.getString('name');

                // If no embed name is provided, show all saved embed names
                if (!embedName) {
                    const embeds = await embedCollection.find().toArray();
                    if (embeds.length === 0) return interaction.reply({ content: '❌ No saved embeds found.', flags: 64 });

                    const embedList = embeds.map(e => `🔹 **${e.name}**`).join('\n');
                    const embed = new EmbedBuilder()
                        .setTitle('📜 Saved Embeds')
                        .setDescription(embedList)
                        .setColor('#3498db');

                    return interaction.reply({ embeds: [embed], flags: 64 });
                }

                // If an embed name is provided, show the full embed
                const embedData = await embedCollection.findOne({ name: embedName.toLowerCase() });
                if (!embedData) return interaction.reply({ content: `❌ No embed found with the name **${embedName}**.`, flags: 64 });

                const embed = new EmbedBuilder()
                    .setColor(embedData.color || '#ffffff')
                    .setTitle(embedData.title || 'No Title')
                    .setDescription(embedData.description || 'No Description')
                    .setThumbnail(embedData.thumbnail || null)
                    .setImage(embedData.image || null)
                    .setTimestamp(embedData.timestamp ? new Date() : null);

                if (embedData.url) embed.setURL(embedData.url);
                if (embedData.author?.name) {
                    embed.setAuthor({
                        name: embedData.author.name,
                        iconURL: embedData.author.icon || null,
                        url: embedData.author.url || null
                    });
                }
                if (embedData.footer?.text) {
                    embed.setFooter({
                        text: embedData.footer.text,
                        iconURL: embedData.footer.icon || null
                    });
                }
                if (embedData.fields?.length) {
                    embed.addFields(embedData.fields.map(f => ({
                        name: f.name,
                        value: f.value,
                        inline: f.inline || false
                    })));
                }

                return interaction.reply({ embeds: [embed], flags: 64 });
            }

            // Delete Embed
            else if (subcommand === 'delete') {
                const name = interaction.options.getString('name').toLowerCase();
                const embed = await embedCollection.findOne({ name });

                if (!embed) return interaction.reply({ content: `❌ No embed found with the name **${name}**.`, ephemeral: true });

                await embedCollection.deleteOne({ name });
                return interaction.reply({ content: `✅ Embed **${name}** has been deleted successfully!`, ephemeral: true });
            }

            else if (subcommand === 'announce') {
                const channel = interaction.options.getChannel('channel');
                const embedName = interaction.options.getString('embed_name');
                const mentionRole = interaction.options.getRole('mention_role');
                const nonEmbedContent = interaction.options.getString('non_embed_content') || '';
                const timer = interaction.options.getInteger('timer');

                let embed;

                // If using a saved embed
                if (embedName) {
                    const embedData = await embedCollection.findOne({ name: embedName.toLowerCase() });
                    if (!embedData) {
                        return interaction.reply({ content: `❌ No embed found with the name **${embedName}**.`, flags: 64 });
                    }

                    // Construct the embed from saved data (EXACTLY like the view command)
                    embed = new EmbedBuilder()
                        .setColor(embedData.color || 0xffffff) // Default to white
                        .setTitle(embedData.title || 'No Title')
                        .setDescription(embedData.description || 'No Description')
                        .setTimestamp(embedData.timestamp ? new Date() : null);

                    if (embedData.url) embed.setURL(embedData.url);
                    if (embedData.image) embed.setImage(embedData.image);
                    if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);

                    // Fix Author Fields
                    if (embedData.author?.name) {
                        embed.setAuthor({
                            name: embedData.author.name,
                            iconURL: embedData.author.icon || null,  // FIXED FIELD MAPPING
                            url: embedData.author.url || null
                        });
                    }

                    // Fix Footer Fields
                    if (embedData.footer?.text) {
                        embed.setFooter({
                            text: embedData.footer.text,
                            iconURL: embedData.footer.icon || null  // FIXED FIELD MAPPING
                        });
                    }

                    // Fix Fields Data
                    if (embedData.fields?.length) {
                        embed.addFields(embedData.fields.map(f => ({
                            name: f.name,
                            value: f.value,
                            inline: f.inline || false
                        })));
                    }
                }
                // If creating a new embed
                else {
                    let color = interaction.options.getString('color');

                    // Validate HEX color (if incorrect, use default)
                    if (!color || !/^#?([0-9A-F]{6})$/i.test(color)) {
                        color = '#3498db'; // Default blue color
                    }

                    embed = new EmbedBuilder()
                        .setColor(parseInt(color.replace('#', ''), 16)) // Convert hex to integer
                        .setTitle(interaction.options.getString('title') || null)
                        .setDescription(interaction.options.getString('description') || null)
                        .setTimestamp(true);

                    if (interaction.options.getString('image')) {
                        embed.setImage(interaction.options.getString('image'));
                    }
                    if (interaction.options.getString('thumbnail')) {
                        embed.setThumbnail(interaction.options.getString('thumbnail'));
                    }

                    // Fix Footer Fields
                    if (interaction.options.getString('footer_text')) {
                        embed.setFooter({
                            text: interaction.options.getString('footer_text'),
                            iconURL: interaction.options.getString('footer_icon') || null
                        });
                    }

                    // Fix Author Fields
                    if (interaction.options.getString('author_name')) {
                        embed.setAuthor({
                            name: interaction.options.getString('author_name'),
                            iconURL: interaction.options.getString('author_icon') || null,
                            url: interaction.options.getString('author_url') || null
                        });
                    }
                }

                // Message Content
                const messageContent = `${mentionRole ? mentionRole.toString() : ''} ${nonEmbedContent}`;

                // Send Embed with Delay if Timer is Set
                if (timer) {
                    setTimeout(() => channel.send({ content: messageContent, embeds: [embed] }), timer * 1000);
                    return interaction.reply({ content: `⏳ Embed will be sent in **${timer} seconds**.`, flags: 64 });
                } else {
                    await channel.send({ content: messageContent, embeds: [embed] });
                    return interaction.reply({ content: '✅ Embed sent successfully!', flags: 64 });
                }
            }


        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: "Alert!",
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash commands!\n- Please use `/embed`')
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

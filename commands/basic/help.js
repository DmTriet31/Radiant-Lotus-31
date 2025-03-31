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


const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the command list and bot information'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
        
            const BOT_ICON = "https://cdn.discordapp.com/emojis/1334648756649590805.png";
            const EMBED_COLOR = "#3498db";
            const COMMANDS_DIR = path.join(__dirname, '../../commands');
            const EXCESS_COMMANDS_DIR = path.join(__dirname, '../../excesscommands');

        
            const getEnabledCategories = (configSet) =>
                Object.entries(configSet)
                    .filter(([_, enabled]) => enabled)
                    .map(([name]) => name);

        
            const readCommands = (basePath, categories) => {
                const commandData = {};
                for (const [category, enabled] of Object.entries(categories)) {
                    if (!enabled) continue;
                    const categoryPath = path.join(basePath, category);

                    try {
                        if (!fs.existsSync(categoryPath)) {
                            //console.warn(`[WARNING] Category folder not found: ${categoryPath}`);
                            continue;
                        }

                        const commands = fs.readdirSync(categoryPath)
                            .filter(file => file.endsWith('.js'))
                            .map(file => {
                                try {
                                    const cmd = require(path.join(categoryPath, file));
                                  
                                    let subcommands = [];
                                    if (cmd.data?.toJSON) {
                                        const dataJSON = cmd.data.toJSON();
                                        if (dataJSON.options && Array.isArray(dataJSON.options)) {
                                            for (const option of dataJSON.options) {
                                               
                                                if (option.type === 1) {
                                                  
                                                    subcommands.push(option.name);
                                                } else if (option.type === 2 && option.options) {
                                                   
                                                    const groupSubs = option.options
                                                        .filter(opt => opt.type === 1)
                                                        .map(opt => opt.name);
                                                 
                                                    subcommands.push(`${option.name}: ${groupSubs.join(', ')}`);
                                                }
                                            }
                                        }
                                    }
                                    return {
                                        name: cmd.data?.name || cmd.name || 'unnamed-command',
                                        description: cmd.data?.description || cmd.description || 'No description provided',
                                        subcommands: subcommands
                                    };
                                } catch (error) {
                                    console.error(`Error loading command ${file} in ${category}:`, error);
                                    return null;
                                }
                            })
                            .filter(cmd => cmd !== null);

                        if (commands.length > 0) {
                            commandData[category] = commands;
                        }
                    } catch (error) {
                        console.error(`Error loading ${category} commands:`, error);
                    }
                }
                return commandData;
            };

            // Create Pages for the help embed
            const createPages = (commandSet, type) => {
                const pages = [];
                const prefixCount = Object.values(prefixCommands).reduce((acc, cmds) => acc + cmds.length, 0);
                const totalCommandsLoaded = Object.values(commandSet).reduce((acc, cmds) => acc + cmds.length, 0);
                let masterCount = 0;
                let subCount = 0;
                for (const category in commandSet) {
                    const cmds = commandSet[category];
                    masterCount += cmds.length;
                    for (const cmd of cmds) {
                        subCount += (cmd.subcommands ? cmd.subcommands.length : 0);
                    }
                }
                const totalCount = masterCount + subCount + prefixCount;
                // Info Page
                pages.push({
                    title: 'Bot Information',
                    description: [
                        `- **Developer:** GlaceYT`,
                        `- **Version:** 1.2.1`,
                        `- **Commands Loaded:** ${totalCommandsLoaded}`,
                        `- **Master Commands:** ${masterCount}`,
                        `- **Sub Commands:** ${subCount}`,
                        `- **Total Commands:** ${totalCount}`,
                        `- **Categories Enabled:** ${getEnabledCategories(config.categories).join(', ')}`,
                        `- **Prefix Commands:** ${Object.values(config.excessCommands).some(v => v) ? 'Enabled' : 'Disabled'}`
                    ].join('\n'),
                    author: { name: 'All In One Bot' }
                });

                // Command Pages for each category
                for (const [category, commands] of Object.entries(commandSet)) {
                    if (commands.length === 0) continue;

                    // Calculate the total subcommands in this category
                    const totalSubcommands = commands.reduce((acc, cmd) => {
                        return acc + (cmd.subcommands ? cmd.subcommands.length : 0);
                    }, 0);
                    const totalNoOfCommands = commands.length + totalSubcommands;
                    const commandLines = commands.map(cmd => {
                        let line = `• **\`${cmd.name}\`** - ${cmd.description}`;
                        if (cmd.subcommands && cmd.subcommands.length > 0) {
                            // Append subcommands count and list each on a new indented line.
                            line += `\n    **Subcommands (${cmd.subcommands.length}):** \n → ${cmd.subcommands.join('\n→ ')}`;
                        }
                        return line;
                    });

                    pages.push({
                        title: `📁 ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: [
                            `**Total Commands:** ${totalNoOfCommands}`,
                            `**Master Commands:** ${commands.length}`,
                            `**Integrated Subcommands:** ${totalSubcommands}`,
                            `**Usage Type:** ${type === 'slash' ? 'Slash Commands' : `Prefix: \`${config.prefix}\``}`
                        ].join('\n'),
                        commands: commandLines,
                        author: { name: `${category.toUpperCase()} COMMANDS` }
                    });
                }

                return pages;
            };

            // Generate Command Sets
            const slashCommands = readCommands(COMMANDS_DIR, config.categories);
            const prefixCommands = readCommands(EXCESS_COMMANDS_DIR, config.excessCommands);

            const slashPages = createPages(slashCommands, 'slash');
            const prefixPages = createPages(prefixCommands, 'prefix');

            // Interaction Handling Variables
            let currentPage = 0;
            let currentSet = slashPages;
            let isPrefix = false;

            // Function to create the embed for the current page.
            const createEmbed = () => {
                const page = currentSet[currentPage];
                const embed = new EmbedBuilder()
                    .setColor(EMBED_COLOR)
                    .setTitle(page.title)
                    .setDescription(page.description)
                    .setAuthor({
                        name: page.author.name,
                        iconURL: BOT_ICON,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setTimestamp();

                // Handle command list fields and ensure each field is within Discord's 1024-character limit.
                if (page.commands && page.commands.length > 0) {
                    // Join all commands with newline separator.
                    const joinedCommands = page.commands.join('\n');
                    if (joinedCommands.length > 1024) {
                        const fields = [];
                        let fieldValue = '';

                        for (const line of page.commands) {
                            // +1 for newline character
                            if (fieldValue.length + line.length + 1 > 1024) {
                                fields.push({ name: 'Command List', value: fieldValue });
                                fieldValue = line + '\n';
                            } else {
                                fieldValue += line + '\n';
                            }
                        }
                        if (fieldValue) {
                            fields.push({ name: 'Command List', value: fieldValue });
                        }
                        embed.setFields(fields);
                    } else {
                        embed.setFields([{ name: 'Command List', value: joinedCommands }]);
                    }
                }
                return embed;
            };

            // Function to create action rows (dropdown and buttons)
            const createComponents = () => {
                const row1 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('pageSelect')
                        .setPlaceholder('Select a category')
                        .addOptions(currentSet.map((page, i) => ({
                            label: page.title.substring(0, 25),
                            value: i.toString(),
                            description: `View ${page.title}`
                        })))
                );

                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Back')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === currentSet.length - 1),
                    new ButtonBuilder()
                        .setCustomId('switchMode')
                        .setLabel(isPrefix ? 'Show Slash Commands' : 'Show Prefix Commands')
                        .setStyle(ButtonStyle.Secondary)
                );

                return [row1, row2];
            };

            // Send initial reply
            const reply = await interaction.reply({
                embeds: [createEmbed()],
                components: createComponents(),
                fetchReply: true
            });

            // Collector Setup to handle interactions
            const collector = reply.createMessageComponentCollector({ time: 120000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) return;

                if (i.isStringSelectMenu()) {
                    currentPage = parseInt(i.values[0]);
                } else if (i.isButton()) {
                    switch (i.customId) {
                        case 'previous':
                            currentPage = Math.max(0, currentPage - 1);
                            break;
                        case 'next':
                            currentPage = Math.min(currentSet.length - 1, currentPage + 1);
                            break;
                        case 'switchMode':
                            isPrefix = !isPrefix;
                            currentSet = isPrefix ? prefixPages : slashPages;
                            currentPage = 0;
                            break;
                    }
                }

                await i.update({
                    embeds: [createEmbed()],
                    components: createComponents()
                });
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] }).catch(() => { });
            });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: "Alert!",
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash command!\n- Please use `/help`')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
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

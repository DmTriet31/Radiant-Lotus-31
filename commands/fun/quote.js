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


const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription(lang.quoteCommandDescription),

    async execute(interaction) {
        const { quoteFallbackText, quoteFallbackAuthor, quoteTitle, quoteFallbackTitle } = lang;
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: quoteFallbackText,
            author: quoteFallbackAuthor
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(quoteTitle)
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(quoteFallbackTitle)
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async executePrefix(message) {
        const { quoteFallbackText, quoteFallbackAuthor, quoteTitle, quoteFallbackTitle } = lang;
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: quoteFallbackText,
            author: quoteFallbackAuthor
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(quoteTitle)
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(quoteFallbackTitle)
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
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


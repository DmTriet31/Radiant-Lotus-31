const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token, guildId } = require('./config.json'); // Cập nhật theo cấu hình của bạn

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Đăng ký lệnh Slash
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Gửi một thông điệp dưới dạng Embed.')
    .addStringOption(option => 
      option.setName('title')
        .setDescription('Tiêu đề của Embed')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('description')
        .setDescription('Mô tả của Embed')
        .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

client.once('ready', async () => {
  try {
    console.log('Đang đăng ký lệnh Slash...');
    
    // Đăng ký lệnh Slash với server
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Lệnh Slash đã được đăng ký thành công!');
  } catch (error) {
    console.error('Lỗi đăng ký lệnh Slash:', error);
  }
});

// Xử lý lệnh /say
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'say') {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('#00FF00')  // Bạn có thể thay đổi màu sắc ở đây
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// Đăng nhập bot
client.login(token);

const client = require('./main');
require('./bot');
require('./shiva');

const loadEventHandlers = () => {
    const colors = require('./UI/colors/colors');

   
    const logSystem = (system, status = '✅') => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(
            `${colors.gray}[${timestamp}]${colors.reset}`,
            `${colors.cyan}[${system.padEnd(15)}]${colors.reset}`,
            `${colors.green}${status}${colors.reset}`
        );
    };

   
    console.clear();
    
  
    const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

   
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.yellow}${colors.bright}             🤖 BOT SYSTEMS INITIALIZATION 🤖${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

   
    console.log(`\n${colors.magenta}${colors.bright}📡 CORE SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));
    

    const guildMemberAddHandler = require('./events/guildMemberAdd');
    guildMemberAddHandler(client);
    logSystem('WELCOME');

  
    const ticketHandler = require('./events/ticketHandler');
    ticketHandler(client);
    logSystem('TICKET');

  
    const voiceChannelHandler = require('./events/voiceChannelHandler');
    voiceChannelHandler(client);
    logSystem('VOICE');

    console.log(`\n${colors.magenta}${colors.bright}🎮 ENGAGEMENT SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

   
    const giveawayHandler = require('./events/giveaway');
    giveawayHandler(client);
    logSystem('GIVEAWAY');

 
    const autoroleHandler = require('./events/autorole');
    autoroleHandler(client);
    logSystem('AUTOROLE');

    const reactionRoleHandler = require('./events/reactionroles');
    reactionRoleHandler(client);
    logSystem('REACTION ROLES');

    console.log(`\n${colors.magenta}${colors.bright}😀 EMOJI & AFK SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

   
    const nqnHandler = require('./events/nqn');
    nqnHandler(client);
    const emojiHandler = require('./events/emojiHandler');
    emojiHandler(client);
    logSystem('NQN');
    logSystem('EMOJI');
    
    
    const afkHandler = require('./events/afkHandler');
    afkHandler(client);
    logSystem('AFK');

    console.log(`\n${colors.magenta}${colors.bright}🔔 NOTIFICATION SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

 
    const startYouTubeNotifications = require('./events/youTubeHandler');
    const startTwitchNotifications = require('./events/twitchHandler');
    const startFacebookNotifications = require('./events/facebookHandler');
    const startInstagramNotifications = require('./events/instagramHandler');

    startYouTubeNotifications(client);
    logSystem('YOUTUBE');
    
    startTwitchNotifications(client);
    logSystem('TWITCH');
    
    startFacebookNotifications(client);
    logSystem('FACEBOOK');
    
    startInstagramNotifications(client);
    logSystem('INSTAGRAM');

  
    console.log(`\n${colors.magenta}${colors.bright}🎵 MUSIC SYSTEM${colors.reset}`);
    console.log('─'.repeat(40));
    require('./events/music')(client);
    logSystem('LAVALINK MUSIC');

    require('./shiva');

   
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.green}${colors.bright}             ✨ ALL SYSTEMS INITIALIZED ✨${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

 
    console.log(`${colors.green}${colors.bright}Status: ${colors.reset}${colors.green}All systems operational${colors.reset}`);
    console.log(`${colors.gray}Last checked: ${colors.reset}${colors.cyan}${new Date().toLocaleTimeString()}${colors.reset}\n`);
};

loadEventHandlers();

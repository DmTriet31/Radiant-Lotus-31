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

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  let data;
  try {
    data = JSON.parse(interaction.customId);
  } catch (err) {
    return;
  }

  if (data.cmd === 'join_voice') {
    const member = interaction.member;
    const vcId = data.vc;

    if (!vcId) {
      return interaction.reply({ content: '❌ Không tìm thấy voice channel.', ephemeral: true });
    }

    const voiceChannel = interaction.guild.channels.cache.get(vcId);
    if (!voiceChannel || voiceChannel.type !== 2) {
      return interaction.reply({ content: '❌ Voice channel không hợp lệ.', ephemeral: true });
    }

    try {
      await member.voice.setChannel(voiceChannel);
      await interaction.reply({ content: `✅ Đã đưa bạn vào voice **${voiceChannel.name}**!`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Không thể đưa bạn vào voice. Có thể bot thiếu quyền hoặc bạn k có ở trong voicechat.', ephemeral: true });
    }
  }
});
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token } = require('./config.json'); // Hoặc từ .env

client.on('ready', () => {
    console.log(`Đã đăng nhập dưới tên: ${client.user.tag}`);
});

// Lắng nghe các interaction (nút bấm)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // Xử lý các nút bấm
    if (interaction.customId === 'buy_spotify') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Spotify Premium**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
    } else if (interaction.customId === 'buy_netflix') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Netflix Share**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
    } else if (interaction.customId === 'buy_ao') {
        await interaction.reply('Cảm ơn bạn đã chọn mua **Áo Thun**! Vui lòng thanh toán qua Momo hoặc ngân hàng và cung cấp thông tin qua DM.');
    }
});

client.login(token);
};

loadEventHandlers();

const client = require('./main'); // client đã được tạo và login trong main.js
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
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.yellow}${colors.bright}             🤖 BOT SYSTEMS INITIALIZATION 🤖${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

    // CORE SYSTEMS
    require('./events/guildMemberAdd')(client); logSystem('WELCOME');
    require('./events/ticketHandler')(client); logSystem('TICKET');
    require('./events/voiceChannelHandler')(client); logSystem('VOICE');

    // ENGAGEMENT SYSTEMS
    require('./events/giveaway')(client); logSystem('GIVEAWAY');
    require('./events/autorole')(client); logSystem('AUTOROLE');
    require('./events/reactionroles')(client); logSystem('REACTION ROLES');

    // EMOJI & AFK
    require('./events/nqn')(client); logSystem('NQN');
    require('./events/emojiHandler')(client); logSystem('EMOJI');
    require('./events/afkHandler')(client); logSystem('AFK');

    // NOTIFICATIONS
    require('./events/youTubeHandler')(client); logSystem('YOUTUBE');
    require('./events/twitchHandler')(client); logSystem('TWITCH');
    require('./events/facebookHandler')(client); logSystem('FACEBOOK');
    require('./events/instagramHandler')(client); logSystem('INSTAGRAM');

    // MUSIC
    require('./events/music')(client); logSystem('LAVALINK MUSIC');

    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.green}${colors.bright}             ✨ ALL SYSTEMS INITIALIZED ✨${colors.reset}`);
    console.log('═'.repeat(60) + '\n');
};

// KHÔNG GỌI client.login(token) ở đây!

client.on('ready', () => {
    console.log(`Đã đăng nhập dưới tên: ${client.user.tag}`);
    loadEventHandlers();
});

// GỘP TẤT CẢ interactionCreate lại làm 1 chỗ
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    let data;
    try {
        data = JSON.parse(interaction.customId);
    } catch (e) {
        data = { cmd: interaction.customId };
    }

    // JOIN VOICE
    if (data.cmd === 'join_voice') {
        const member = interaction.member;
        const vcId = data.vc;
        const voiceChannel = interaction.guild.channels.cache.get(vcId);

        if (!voiceChannel || voiceChannel.type !== 2) {
            return interaction.reply({ content: '❌ Voice channel không hợp lệ.', ephemeral: true });
        }

        try {
            await member.voice.setChannel(voiceChannel);
            await interaction.reply({ content: `✅ Đã đưa bạn vào voice **${voiceChannel.name}**!`, ephemeral: true });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: '❌ Không thể đưa bạn vào voice.', ephemeral: true });
        }
    }

    // MUA HÀNG
    if (data.cmd === 'buy_spotify') {
        return interaction.reply('Cảm ơn bạn đã chọn mua **Spotify Premium**!');
    } else if (data.cmd === 'buy_netflix') {
        return interaction.reply('Cảm ơn bạn đã chọn mua **Netflix Share**!');
    } else if (data.cmd === 'buy_ao') {
        return interaction.reply('Cảm ơn bạn đã chọn mua **Áo Thun**!');
    }
});
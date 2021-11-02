import { config as initEnv } from 'dotenv';
import { Client, Intents } from 'discord.js';
import config from './config.json';

initEnv();

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS];
const bot = new Client({ disableMentions: 'everyone', intents: intents });

const cache = {
    last_number: 0,
    last_user: null
}

bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}`));

bot.on('messageCreate', message => {
    if (['429493473259814923'].includes(message.author.id) && message.content.startsWith(config['prefix'])) {
        const cmdArr = message.content.split(' ');
        const command = cmdArr.shift().substr(config['prefix'].length);
        switch(command) {
            case 'set': {
                cache.last_number = cmdArr[0];
                console.log(cache.last_number);
                break;
            }
        }
    } else {
        if (message.channel.id == config['counter-channel']) {
            if (isNaN(Number(message.content))) {
                message.delete();
                console.log('1');
            } else if (Number(message.content) != cache.last_number + 1 || cache.last_user == message.author.id) {
                console.log('2');
                message.delete();
            } else {
                console.log('3');
                cache.last_number = Number(message.content);
                cache.last_user = message.author.id;
            }
        }
    }
});

bot.login(process.env.TOKEN);
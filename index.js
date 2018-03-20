process.env.NTBA_FIX_319 = true;
const TelegramBot = require('node-telegram-bot-api');
const config = require('config');
const getMessage = require('./lib/wrap.js');
const anekdot = require('./anekdots');
const Groups = require('./groups');
const version = require('./package.json').version;
const makeChatMessage = require('./lib/makeChatMessage.js');

const TOKEN = process.env.TOKEN;
const URL = process.env.APP_URL;
const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: process.env.PORT || config.get('port'),
        autoOpen: false
    }
});

bot.openWebHook();
bot.setWebHook(URL + '/bot' + TOKEN);


bot.on('inline_query', query => {
    let results = [];

    if (query.query.trim() !== '') {
        let l = "лопата";
        let s = "сарказм";
        let m = getMessage(query.query, l);

        results = [
            {
                id: query.id + '-3',
                type: 'article',
                title: '</' + s + '>',
                description: 'Просто обернуть',
                input_message_content: {
                    message_text: getMessage(query.query, s),
                    parse_mode:  'Markdown'
                }
            },
            {
                id: query.id + '-2',
                type: 'article',
                title: '#хохма </' + l + '>',
                description: 'Обернуть и добавить хештег #хохма',
                input_message_content: {
                    message_text: "#хохма \n" + m,
                    parse_mode:  'Markdown'
                }
            },
            {
                id: query.id + '-1',
                type: 'article',
                title: '</' + l  + '>',
                description: 'Просто обернуть',
                input_message_content: {
                    message_text: m,
                    parse_mode:  'Markdown'
                }
            }
        ];
    }

    bot.answerInlineQuery(query.id, results, { cash_time: 0 });
});

bot.onText(/\/start\b/, msg => {
    bot.sendMessage(msg.chat.id, config.get('phrases.welcome'));
});

bot.onText(/\/help\b/, msg => {
    let message = config.get('phrases.welcome');
    message += "\n\n";
    message += config.get('phrases.help');
    bot.sendMessage(msg.chat.id, message);
});

bot.onText(/\/anekdot/, msg => {
    anekdot((data) => {
        bot.sendMessage(msg.chat.id, data);
    });
});

bot.onText(/\/version/, msg => {
    bot.sendMessage(msg.chat.id, version);
});

let groups = new Groups((ids) => {
    if (ids.length) {
        anekdot((data) => {
            let message = makeChatMessage(data, 'morning');
            ids.forEach((id) => {
                bot.sendMessage(id, message);
            });
        });
    }
});

bot.onText(/\/startnotices/, msg => {
    groups.add(msg.chat.id);
});

bot.onText(/\/stopnotices/, msg => {
    groups.remove(msg.chat.id);
});

groups.startJob();

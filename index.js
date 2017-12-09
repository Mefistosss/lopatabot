const config = require('config');
const TelegramBot = require('node-telegram-bot-api');
const getMessage = require('./lib/wrap.js');

process.env.NTBA_FIX_319 = true;

const TOKEN = config.get('token');

const URL = process.env.APP_URL || config.get('url');

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: process.env.PORT || config.get('port'),
        autoOpen: false
    }
});

console.log(process.env.APP_URL, process.env.PORT);

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

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, welcome);
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, config.get('phrases.welcome'));
});

const config = require('config');
const TelegramBot = require('node-telegram-bot-api');
const getMessage = require('./lib/wrap.js');

process.env.NTBA_FIX_319 = true;

const TOKEN = config.get('token');

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: config.get('port'),
        autoOpen: false
    }
});

bot.openWebHook();
bot.setWebHook(config.get('url') + '/bot' + TOKEN);


bot.on('inline_query', query => {
    let m = getMessage(query.query);

    bot.answerInlineQuery(query.id, [
        {
            id: query.id + '-2',
            type: 'article',
            title: '#хохма <лопата>...</лопата>',
            description: 'Обернуть и добавить хештег #хохма',
            input_message_content: { message_text: "#хохма \n" + m }
        },
        {
            id: query.id + '-1',
            type: 'article',
            title: '<лопата>...</лопата>',
            description: 'Просто обернуть',
            input_message_content: {
                message_text: m,
                parse_mode:  'Markdown'
            }
        }
    ], {
        cash_time: 0
    })
});

let welcome = "О преветствую тебя юный подаван тонкого юмораю.\nОбращайся ко мне, я помогу сказать всем, что нужно смеяться.\nЯ умею оборачивать твое сообщение в тег <лопата>";

bot.onText(/\/start (.+)/, msg => {
    bot.sendMessage(msg.chat.id, welcome);
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, welcome);
});

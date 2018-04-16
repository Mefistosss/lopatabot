process.env.NTBA_FIX_319 = true;
var TelegramBot = require('node-telegram-bot-api');
var config = require('config');
var getMessage = require('./lib/wrap.js');
var anekdot = require('./anekdots');
var Groups = require('./groups');
var version = require('./package.json').version;
var makeChatMessage = require('./lib/makeChatMessage.js');
var db = require('./data/db.js');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

db(function () {
    var PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.get('port');
    var TOKEN = process.env.TOKEN;
    var URL = process.env.APP_URL || process.env.OPENSHIFT_NODEJS_IP;

    var bot = new TelegramBot(TOKEN, {
        webHook: {
            port: PORT,
            autoOpen: false
        }
    });

    bot.openWebHook();
    bot.setWebHook(URL + '/bot' + TOKEN);


    bot.on('inline_query', function (query) {
        var results = [];

        if (query.query.trim() !== '') {
            var l = "лопата";
            var s = "сарказм";
            var m = getMessage(query.query, l);

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

    bot.onText(/\/start\b/, function (msg) {
        bot.sendMessage(msg.chat.id, config.get('phrases.welcome'));
    });

    bot.onText(/\/help\b/, function (msg) {
        var message = config.get('phrases.welcome');
        message += "\n\n";
        message += config.get('phrases.help');
        bot.sendMessage(msg.chat.id, message);
    });

    bot.onText(/\/anekdot/, function (msg) {
        anekdot(function (data) {
            bot.sendMessage(msg.chat.id, data);
        });
    });

    bot.onText(/\/version/, function (msg) {
        bot.sendMessage(msg.chat.id, version);
    });

    var groups = new Groups(function (ids) {
        if (ids.length) {
            anekdot(function (data) {
                var message = makeChatMessage(data, 'morning');
                ids.forEach(function (id) {
                    bot.sendMessage(id, message);
                });
            });
        }
    });

    bot.onText(/\/startnotices/, function (msg) {
        groups.add(msg.chat, function (err, message) {
            if (!err) {
                bot.sendMessage(msg.chat.id, message);
            }
        });
    });

    bot.onText(/\/stopnotices/, function (msg) {
        groups.remove(msg.chat.id, function (err, message) {
            if (!err) {
                bot.sendMessage(msg.chat.id, message);
            }
        });
    });

    groups.startJob();

    console.log('URL', URL);
    console.log('PORT', PORT);
});

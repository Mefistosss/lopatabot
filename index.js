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

var PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.get('port');
var TOKEN = process.env.TOKEN;
var URL = process.env.APP_URL || process.env.OPENSHIFT_NODEJS_IP;


var bot = new TelegramBot(TOKEN, {
    webHook: {
        port: PORT,
        autoOpen: false,
        healthEndpoint: "/pagecount"
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
    var sendAnekdot = function (_id, _message) {
        bot.sendMessage(_id, _message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Хочу еще!",
                            callback_data: 'i_want_more'
                        }
                    ]
                ]
            }
        });
    };

    var getPrivatePhras = function (name) {
        return "Доброе утро " + name + "!\n\n";
    };

    var each = function (_ids, callback, isPrivate) {
        if (_ids.length) {
            anekdot(function (data) {
                var message;
                if (isPrivate) {
                    message = data; 
                } else {
                    message = makeChatMessage(data, 'morning');
                }

                _ids.forEach(function (idData) {
                    if (isPrivate) {
                        message = getPrivatePhras(idData.name) + message;
                    }
                    sendAnekdot(idData.id, message);
                });
                callback();
            });
        } else {
            callback();
        }
    }

    each(ids.group, function () {
        each(ids.private, function () {
            console.log('Anekdots was sent.');
        }, true);
    });
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

// bot.onText(/\/test/, function (msg) {
//     anekdot(function (data) {
//         bot.sendMessage(msg.chat.id, data, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [
//                         {
//                             text: "Хочу еще!",
//                             callback_data: 'i_want_more'
//                         }
//                     ]
//                 ]
//             }
//         });
//     });
// });

// bot.onText(/\/send/, function (msg) {
//     groups.send();
// });

bot.on('callback_query', function (query) {
    if (query.data === 'i_want_more') {
        anekdot(function (data) {
            var parse = 'Oooo, ' + (query.from.first_name || query.from.username) + ' хочет еще.\n\n';
            bot.sendMessage(query.message.chat.id, parse + data);
            bot.answerCallbackQuery({ callback_query_id: query.id }); 
        });
    }
});

db(function (err) {
    if (!err) {
        console.log('JOB STARTED');
        groups.startJob();
    }
});

console.log('URL', URL);
console.log('PORT', PORT);



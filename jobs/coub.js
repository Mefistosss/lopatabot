var async = require('async');
var coub = require('../coub');
var delivery = require('../lib/delivery.js');
var makeChatMessage = require('../lib/makeChatMessage.js');

function getCoub(next) {
    coub(function (data) {
        next(null, data);
    });
}

function groups (ids, callback, next) {
    if (ids.length) {
        async.auto({
            joke: getCoub,
            send: ['joke', function (results, _next) {
                var message = makeChatMessage(results.joke, 'coub');
                delivery(ids, function (groupOfIds) {
                    callback(groupOfIds, message);
                }, _next);
            }]
        }, next);
    } else {
        next();
    }
}

function private (ids, callback, next) {
    if (ids.length) {
        async.auto({
            joke: getCoub,
            send: ['joke', function (results, _next) {
                delivery(ids, function (groupOfIds) {
                    callback(groupOfIds, results.joke);
                }, _next);
            }]
        }, next);
    } else {
        next();
    }
}

module.exports = function(bot, ids, callback) {
    async.series([
        function (next) {
            groups(ids.group, function (groupOfIds, message) {
                groupOfIds.forEach(function (idData) {
                    bot.sendMessage(idData.id, message, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Хочу еще!",
                                        callback_data: 'i_want_more_coub'
                                    }
                                ]
                            ]
                        }
                    });
                });
            }, next);
        },
        function (next) {
            private(ids.private, function (groupOfIds, message) {
                groupOfIds.forEach(function (idData) {
                    var _message = makeChatMessage(message, 'coub', idData.name);

                    bot.sendMessage(idData.id, _message, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Хочу еще!",
                                        callback_data: 'i_want_more_coub'
                                    }
                                ]
                            ]
                        }
                    });
                });
            }, next);
        }
    ], function(err) {
        callback();
    });
}

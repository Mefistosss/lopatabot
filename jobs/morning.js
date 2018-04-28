var async = require('async');
var anekdot = require('../anekdots');
var delivery = require('../lib/delivery.js');
var makeChatMessage = require('../lib/makeChatMessage.js');

function getAnekdot(next) {
    anekdot(function (data) {
        next(null, data);
    });
}

function groups (ids, callback, next) {
    if (ids.length) {
        async.auto({
            joke: getAnekdot,
            send: ['joke', function (results, _next) {
                var message = makeChatMessage(results.joke, 'morning');
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
            joke: getAnekdot,
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
                                        callback_data: 'i_want_more'
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
                    var _message = makeChatMessage(message, 'morning', idData.name);

                    bot.sendMessage(idData.id, _message, {
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
                });
            }, next);
        }
    ], function(err) {
        callback();
    });
}

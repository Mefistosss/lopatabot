var async = require('async');
var config = require('config');
var comics = require('../comics/xkcd/ru');
var HashData = require('../data/models/hashdata').HashData;
var delivery = require('../lib/delivery.js');

var phrase = config.get('phrases.newComics');

function getComics(next) {
    comics(function (err, message) {
        next(err, message);
    }, false, true);
}

function checkComics(results, next) {
    var hd, time;
    if (results.comics) {
        HashData.find({ dataType: 'xkcdru' }, function (err, datas) {
            if (err) {
                next(err);
            } else {
                time = new Date();

                if (datas.length) {
                    hd = datas[0];

                    if (hd.hashData === results.comics) {
                        next(null, false);
                    } else {
                        hd.hashData = results.comics;
                        hd.timeDate = time;

                        hd.save(function (_err) {
                            if (_err) {
                                next(_err, false);
                            } else {
                                next(null, true);
                            }
                        });
                    }
                } else {
                    hd = new HashData({
                        dataType: 'xkcdru',
                        hashData: results.comics,
                        timeDate: time
                    });

                    hd.save(function (_err) {
                        if (_err) {
                            next(_err, false);
                        } else {
                            next(null, true);
                        }
                    });
                }
            }
        });
    } else {
        next(null, false);
    }
}

function send (ids, callback, next) {
    if (ids.length) {
        delivery(ids, function (groupOfIds) {
            groupOfIds.forEach(function (idData) {
                callback(idData.id);
            });
        }, next);
    } else {
        next();
    }
}

module.exports = function(bot, ids, callback) {
    async.auto({
        comics: getComics,
        canSend: ['comics', checkComics],
        group: ['canSend', function (results, next) {
            if (results.canSend) {
                send(ids.group, function (id) {
                    bot.sendMessage(id, phrase + '\n\n' + results.comics);
                }, next);
            } else {
                next();
            }
        }],
        private: ['group', function (results, next) {
            if (results.canSend) {
                send(ids.private, function (id) {
                    bot.sendMessage(id, phrase + '\n\n' + results.comics);
                }, next);
            } else {
                next();
            }
        }]
    }, callback);
}

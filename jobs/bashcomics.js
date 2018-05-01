var async = require('async');
var config = require('config');
var comics = require('../comics/bash');
var HashData = require('../../data/models/hashdata').HashData;
var delivery = require('../lib/delivery.js');

var message = config.get('phrases.newComics') + "\n\n";

function checkComics (results, next) {
    var hd, time;
    if (results.comics) {
        HashData.find({ dataType: 'bashcomics' }, function (err, datas) {
            if (err) {
                next(err);
            } else {
                time = new Date(results.comics.pubDate);

                if (datas.length) {
                    hd = datas[0];

                    if (hd.hashData === results.comics.url && (!hd.timeDate || hd.timeDate.toString() === time.toString())) {
                        next(null, false);
                    } else {
                        hd.hashData = results.comics.url;
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
                        dataType: 'bashcomics',
                        hashData: results.comics.url,
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

function send (ids, comicsUrl, callback) {
    if (ids.length) {
        delivery(ids, function (groupOfIds) {
            groupOfIds.forEach(function (idData) {
                bot.sendMessage(idData.id, message + comicsUrl);
            });
        }, callback);
    } else {
        callback();
    }
}

module.exports = function(bot, ids, callback) {
    async.auto({
        comics: comics,
        canSend: ['comics', checkComics],
        group: ['canSend', function (results, next) {
            if (results.canSend) {
                send(ids.group, results.comics.url, next);
            } else {
                next();
            }
        }],
        private: ['group', function (results, next) {
            if (results.canSend) {
                send(ids.private, results.comics.url, next);
            } else {
                next();
            }
        }]
    }, callback);
}

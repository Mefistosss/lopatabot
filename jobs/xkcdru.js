var async = require('async');
var config = require('config');
var comics = require('../comics/xkcd/ru');
var delivery = require('../lib/delivery.js');

var phrase = config.get('phrases.newComics');

function getComics(next) {
    comics(function (err, message) {
        next(err, message);
    }, false, true);
}

function checkComics(results, next) {
    next(null, !!results.comics);
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
                    bot.sendMessage(id, results.comics);
                }, next);
            } else {
                next();
            }
        }],
        private: ['group', function (results, next) {
            if (results.canSend) {
                send(ids.private, function (id) {
                    bot.sendMessage(id, results.comics);
                }, next);
            } else {
                next();
            }
        }]
    }, callback);
}

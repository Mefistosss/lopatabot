var config = require('config');
var random = require('../lib/random.js');
var error = config.get('error');
var phrases = config.get('insteadAnekdot');
var sites = config.get('anekdotSites');

var lastAnekdots = [];

var getArticle = function (callback, index) {
    var anekdot, isNotLast;

    isNotLast = index < sites.length - 1;

    anekdot = require('./' + sites[index].name + '/index.js');

    anekdot(sites[index].url, function (err, data) {
        if (err) {
            if (isNotLast) {
                getArticle(callback, index + 1);
            } else {
                callback(err);
            }
        } else {
            if (data && data.trim() !== '') {
                if (lastAnekdots[index] === data) {
                    if (isNotLast) {
                        getArticle(callback, index + 1);
                    } else {
                        callback(null, data, true);
                    }
                } else {
                    lastAnekdots[index] = data;
                    callback(null, data);
                }
            } else {
                if (isNotLast) {
                    getArticle(callback, index + 1);
                } else {
                    callback(null, null);
                }
            }
        }
    });
};

module.exports = function(callback) {
    getArticle(function (err, data, isSame) {
        var currentAnekdot;
        if (err) {
            currentAnekdot = error;
        } else {
            if (data) {
                if (isSame) {
                    currentAnekdot = phrases[random(phrases.length - 1)];
                } else {
                    currentAnekdot = data;
                }
            } else {
                currentAnekdot = phrases[random(phrases.length - 1)];
            }
        }
        callback(currentAnekdot);
    }, 0);
}

const config = require('config');
const random = require('../lib/random.js');
const error = config.get('error');
const phrases = config.get('insteadAnekdot');
const sites = config.get('anekdotSites');

let lastAnekdots = [];

let getArticle = (callback, index) => {
    let anekdot, isNotLast;

    isNotLast = index < sites.length - 1;

    anekdot = require('./' + sites[index].name + '/index.js');

    anekdot(sites[index].url, (err, data) => {
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
    getArticle((err, data, isSame) => {
        let currentAnekdot;
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

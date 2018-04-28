var config = require('config');
var random = require('../lib/random.js');
var error = config.get('error');
var phrases = config.get('insteadAnekdot');
var sites = config.get('anekdotSites');

var getArticle = function (callback, index) {
    var anekdot = require('./' + sites[index].name + '/index.js');
    anekdot(sites[index].url, callback);
};

module.exports = function(callback) {
    getArticle(function (err, data) {
        var currentAnekdot;
        if (err) {
            currentAnekdot = error;
        } else {
            if (data) {
                currentAnekdot = data;
            } else {
                currentAnekdot = phrases[random(phrases.length - 1)];
            }
        }
        callback(currentAnekdot);
    }, 0);
}

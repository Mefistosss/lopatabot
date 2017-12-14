const config = require('config');
const random = require('../lib/random.js');

const sites = config.get('anekdotSites');
let lastAnekdot = '';

module.exports = function(forse, callback) {
    let anekdot = require('./' + sites[0].name + '/index.js');

    anekdot(sites[0].url, (err, data) => {
        if (err) {
            callback(config.get('error'));
        } else {
            let currentAnekdot = data[0];
            if (!forse) {
                if (currentAnekdot !== lastAnekdot) {
                    lastAnekdot = currentAnekdot;
                } else {
                    let phrases = config.get('insteadAnekdot');
                    currentAnekdot = phrases[random(phrases.length - 1)];
                }
            }
            
            callback(currentAnekdot);
        }
    });
}

const config = require('config');
const sites = config.get('anekdotSites');

module.exports = function(callback) {
    let anekdot = require('./' + sites[0].name + '/index.js');

    anekdot(sites[0].url, (err, data) => {
        if (err) {
            callback('Ой!');
        } else {
            callback(data[0]);
        }
    });
}
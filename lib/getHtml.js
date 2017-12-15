const axios = require('axios');
const parse5 = require('parse5');

module.exports = function(url, callback) {
    axios.get(url).then(response => {
        try {
            callback(null, parse5.parse(response.data));
        } catch(e) {
            console.log(e);
        }
    }).catch(error => {
        console.log('catch');
        callback(error);
    });
}

const axios = require('axios');
const parse5 = require('parse5');

module.exports = function(url, callback) {
    axios.get(url).then(response => {
        callback(null, parse5.parse(response.data));
    }).catch(error => {
        callback(error);
    });
}

const parse5 = require('parse5');
const iconv = require('iconv-lite');
const isHttps = require('./isHttps.js');

module.exports = function(url, callback, decode) {
    let protocol;

    if (isHttps(url)) {
        protocol = require("https");
    } else {
        protocol = require("http");
    }

    protocol.get(url, (res) => {
        if (decode) {
            res.pipe(iconv.decodeStream("win1251")).collect((err, data) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, parse5.parse(data));
                }
            });
        } else {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                callback(null, parse5.parse(data.toString()));
            });
        }
    }).on('error', (e) => {
        callback(e.message);
    });
};

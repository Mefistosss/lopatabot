var parse5 = require('parse5');
var iconv = require('iconv-lite');
var isHttps = require('./isHttps.js');

module.exports = function(url, callback, decode) {
    var protocol;

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
            var data = '';

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

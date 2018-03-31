var parse5 = require('parse5');
var iconv = require('iconv-lite');
var isHttps = require('./isHttps.js');

module.exports = function (url, callback, decode) {
    var protocol;

    if (isHttps(url)) {
        protocol = require("https");
    } else {
        protocol = require("http");
    }

    protocol.get(url, function (res) {
        if (decode) {
            res.pipe(iconv.decodeStream("win1251")).collect(function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, parse5.parse(data));
                }
            });
        } else {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                callback(null, parse5.parse(data.toString()));
            });
        }
    }).on('error', function (e) {
        callback(e.message);
    });
};

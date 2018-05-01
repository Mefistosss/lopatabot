var config = require('config');
var https = require('https');

var coub = config.get('coub');
var options = {
    hostname: coub.hostname,
    path: coub.path,
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
};

function check (permalink) {
    var result = true;

    // nsfw - 18+
    if (permalink === 'news' || permalink === 'nsfw') {
        result = false;
    }

    return result;
}

function getCoub (callback) {
    var req = https.request(options, function (res) {
        var data = '';

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            var result = null;

            try {
                result = JSON.parse(data);
            } catch (e) {
                console.log("COUB BAD RESULT");
                result = null
            }

            if (result && result.coubs && result.coubs.length) {
                result = result.coubs[0];
            }

            if (!result || result.categories.length && check(result.categories[0].permalink)) {
                callback(result);
            } else {
                getCoub(callback);
            }
        });
    });

    req.on('error', function (e) {
        console.log('COUB ERROR', e);
        callback(null);
    });

    req.end();
}

module.exports = function(callback) {
    getCoub(function (data) {
        var message;

        if (data) {
            message = data.title + '\n';
            message += ('https://coub.com/view/' + data.permalink);
        } else {
            message = config.get('error');
        }

        callback(message);
    });
}

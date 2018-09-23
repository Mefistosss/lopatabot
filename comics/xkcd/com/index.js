var xkcd = require('xkcd-api');

module.exports = function(callback) {
    xkcd.random(function(err, response) {
        var message = null;

        if (err) {
            callback(err);
        } else {
            if (response) {
                message = '';
                if (response.title) {
                    message += response.title;
                    message += '\n\n';
                }

                if (response.alt) {
                    message += response.alt;
                    message += '\n\n';
                }

                message += response.img;
            }

            callback(null, message);
        }
    });
};

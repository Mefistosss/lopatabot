var config = require('config');
var rss = require('../../lib/getRss.js');
var getUrl = require('../../lib/getUrlFromImg.js');

module.exports = function(callback) {
    var url = config.get('comicsSites.bash');
    rss(url, function (err, items) {
        if (err) {
            callback(err);
        } else {
            if (items.length) {
                var item = items[0];
                callback(null, {
                    pubDate: item.pubDate,
                    url: getUrl(item.content)
                });
            } else {
                callback(null, null);
            }
        }
    });
}

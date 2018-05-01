let Parser = require('rss-parser');
let parser = new Parser();

// parser.parseURL('https://bash.im/rss/comics.xml', function (err, feed) {
//     console.log(feed.title);
//     feed.items.forEach(function(entry) {
//         console.log(entry.pubDate, entry.content);
//     });
// });

module.exports = function (url, callback) {
    parser.parseURL(url, function (err, feed) {
        if (err) {
            callback(err);
        } else {
            callback(null, feed.items);
        }
    });
}

var domObj = require('../../lib/getHtml.js');
var getDomObjects = require('../../lib/getDomObjects.js');
var article = require('./article.js');

var ARTICLE_CLASS = 'q';

module.exports = function(url, callback) {
    domObj(url, function (err, dom) {
        if (err) {
            callback(err);
        } else {
            var rawArticle = getDomObjects(dom, ARTICLE_CLASS);
            var _article = article(rawArticle);
            callback(null, _article);
        }
    }, true);
};

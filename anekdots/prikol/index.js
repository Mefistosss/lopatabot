var domObj = require('../../lib/getHtml.js');
var getDomObjects = require('../../lib/getDomObjects.js');
var articles = require('./articles.js');

var ARTICLE_CLASS = 'widget-article_joke';

module.exports = function (url, callback) {
    domObj(url, function (err, dom) {
        if (err) {
            callback(err);
        } else {
            var rawArticles = getDomObjects(dom, ARTICLE_CLASS);
            var _articles = articles(rawArticles);
            callback(null, (_articles && _articles.length) ? _articles[0] : null);
        }
    });
};

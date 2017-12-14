const domObj = require('../../lib/getHtml.js');
const getDomObjects = require('../../lib/getDomObjects.js');
const articles = require('./articles.js');

const ARTICLE_CLASS = 'widget-article_joke';

module.exports = function(url, callback) {
    domObj(url, (err, dom) => {
        if (err) {
            callback(err);
        } else {
            let rawArticles = getDomObjects(dom, ARTICLE_CLASS);
            let _articles = articles(rawArticles);
            callback(null, _articles);
        }
    });
};

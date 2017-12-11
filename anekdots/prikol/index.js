const domObj = require('../../lib/getHtml.js');
const getDomObject = require('../../lib/getDomObject.js');
const articles = require('./articles.js');

const ARTICLE_CLASS = 'widget-article_joke';

module.exports = function(url, callback) {
    domObj(url, (err, dom) => {
        if (err) {
            callback(err);
        } else {
            let rawArticles = getDomObject(dom, ARTICLE_CLASS);
            let articles = articles(rawArticles);
            callback(null, articles);
        }
    });
};

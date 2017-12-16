const domObj = require('../../lib/getHtml.js');
const getDomObjects = require('../../lib/getDomObjects.js');
const article = require('./article.js');

const ARTICLE_CLASS = 'q';

module.exports = function(url, callback) {
    domObj(url, (err, dom) => {
        if (err) {
            callback(err);
        } else {
            let rawArticle = getDomObjects(dom, ARTICLE_CLASS);
            let _article = article(rawArticle);
            callback(null, _article);
        }
    }, true);
};

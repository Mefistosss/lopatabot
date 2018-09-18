var async = require('async');
var config = require('config');
var domObj = require('../../../lib/getHtml.js');
var getDomObjects = require('../../../lib/getDomObjects.js');
// var article = require('./article.js');

var rss = require('../../../lib/getRss.js');
var parse5 = require('parse5');

var ARTICLE_CLASS = 'main';
var last = undefined;

function getNumber(fromData) {
    var result = /\/([0-9]+)\//.exec(fromData);

    if (result) {
        result = result[1];
    }

    return result;
}

function getImgSrc(str) {
    var i,
        result = null;

    try {
        result = parse5.parse(str);
        result = result.childNodes[0].childNodes[1].childNodes[0].childNodes[0].attrs;

        for (i = 0; i < result.length; i++) {
            if (result[i].name === 'src') {
                result = result[i].value;
                break;
            }
        }
    } catch (e) {
        result = null;
    }

    return result;
}

module.exports = function(callback, isRandom, newLast) {

isRandom = true;
// newLast = true;

    async.auto({
        getLast: function (_callback) {
            if (last && !newLast) {
                _callback(null, last);
            } else {
                var url = config.get('comicsSites.xkcdru.rss'), item;
                rss(url, function (err, items) {
                    if (err) {
                        _callback(err);
                    } else {
                        if (items.length) {
                            item = items[0];
                            item.img = getImgSrc(item.content);
                            _callback(null, item);
                        } else {
                            _callback(true);
                        }
                    }
                });
            }
        },

        getComics: ['getLast', function (result, next) {
            var isTheSame = (result.getLast === last), url, id;

            last = result.getLast;

            if (isRandom) {
                url = config.get('comicsSites.xkcdru.url');

                id = getNumber(last.link);

                if (id) {
                    console.log(url + '/random/' + id + '/');
                    domObj(url + '/random/' + id + '/', function (err, dom) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log(dom);
                            var rawArticle = getDomObjects(dom, ARTICLE_CLASS);

                            console.log(rawArticle);


                            // var _article = article(rawArticle);
                            // callback(null, _article);
                        }
                    }, true);
                } else {
                    next(null, null);
                }
            } else {
                if (isTheSame) {
                    next(null, null);
                } else {
                    next(null, {
                        title: last.title,
                        contentSnippet: last.contentSnippet,
                        img: last.img
                    });
                }
            }
        }]
    }, function (err, result) {
        console.log(err, result.getComics);
        if (err) {

        } else {

        }
    });
};

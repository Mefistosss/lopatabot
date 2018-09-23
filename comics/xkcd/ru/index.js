var async = require('async');
var config = require('config');
var domObj = require('../../../lib/getHtml.js');
var getDomObjects = require('../../../lib/getDomObjects.js');
var random = require('../../../lib/random.js');
var getNums = require('./getNums.js');
var article = require('./article.js');

var ARTICLE_CLASS = 'main';
var nums = [];

function isNew(_nums) {
    var result = false;

    if (_nums.length) {
        if (nums.length) {
            try {
                result = (parseInt(nums[nums.length - 1], 10) < parseInt(_nums[_nums.length - 1], 10))
            } catch (e) {}
        } else {
            result = true;
        }
    }

    return result;
}

module.exports = function(callback, isRandom, newNums) {
    async.auto({
        getNums: function (_callback) {
            if (nums.length && !newNums) {
                _callback(null, {
                    isNew: false,
                    nums: nums
                });
            } else {
                getNums(function (err, _nums) {
                    if (err) {
                        _callback(null, {
                            isNew: false,
                            nums: nums
                        });
                    } else {
                        var _isNew = isNew(_nums);

                        if (_isNew) { nums = _nums; }

                        _callback(null, {
                            isNew: _isNew,
                            nums: nums
                        });
                    }
                });
            }
        },

        getComics: ['getNums', function (result, next) {
            var id, url;

            if (result.getNums.nums.length) {
                if (isRandom || result.getNums.isNew) {
                    if (isRandom) {
                        id = random(result.getNums.nums.length - 1);
                    } else {
                        id = result.getNums.nums[result.getNums.nums.length - 1];
                    }

                    url = config.get('comicsSites.xkcdru.url');

                    domObj(url + '/' + id + '/', function (err, dom) {
                        if (err) {
                            callback(err);
                        } else {
                            var rawArticle = getDomObjects(dom, ARTICLE_CLASS);
                            next(null, article(rawArticle[0].childNodes));
                        }
                    }, false);

                } else {
                    next(null, null);
                }
            } else {
                next(null, null);
            }
        }]
    }, function (err, result) {
        var message = null;

        if (result) {
            message = '';

            if (result.getComics.title) {
                message += result.getComics.title;
                message += '\n\n';
            }

            if (result.getComics.comicsText) {
                message += result.getComics.comicsText;
                message += '\n\n';
            }

            message += result.getComics.img;
        }

        callback(err, message);        
    });
};

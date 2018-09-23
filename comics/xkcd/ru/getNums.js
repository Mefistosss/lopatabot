var config = require('config');
var domObj = require('../../../lib/getHtml.js');
var getDomObjects = require('../../../lib/getDomObjects.js');
var hasClass = require('../../../lib/hasClass.js');
var getAttr = require('../../../lib/getAttr.js');
var getFirstChildByTag = require('../../../lib/getFirstChildByTag.js');

module.exports = function(callback) {
    var url = config.get('comicsSites.xkcdru.nums');

    domObj(url, function (err, dom) {
        var rawData, tmp, result = [];
        if (err) {
            callback(err, result);
        } else {
            rawData = getDomObjects(dom, 'list');

            if (rawData && rawData.length && rawData[0].childNodes && rawData[0].childNodes.length) {
                rawData[0].childNodes.forEach(function (value) {
                    if (hasClass(value.attrs, 'real')) {
                        if (value.childNodes && value.childNodes.length) {
                            tmp = getFirstChildByTag(value.childNodes, 'a');
                            if (tmp) {
                                tmp = getAttr(tmp.attrs, 'href');
                                if (tmp) {
                                    result.push(tmp.replace(/\//g, ''));
                                }
                            }
                            
                        }
                    }
                });
            }

            callback(null, result);
        }
    }, true);
}

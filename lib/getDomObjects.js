var getObjectValueByClass = require('./getObjectValueByClass.js');

var getDomObjects = function (body, nodeClass) {
    var result = [], r;

    if (body.childNodes && body.childNodes.length) {
        r = new RegExp('\\b' + nodeClass + '\\b');
        body.childNodes.forEach(function (node) {
            if (r.test(getObjectValueByClass(node.attrs))) {
                result.push(node);
            } else {
                result = result.concat(getDomObjects(node, nodeClass));
            }
        });
    }

    return result;
}

module.exports = getDomObjects;
var hasClass = require('./hasClass.js');

var getDomObjects = function (body, nodeClass) {
    var result = [];

    if (body.childNodes && body.childNodes.length) {
        body.childNodes.forEach(function (node) {
            if (hasClass(node.attrs, nodeClass)) {
                result.push(node);
            } else {
                result = result.concat(getDomObjects(node, nodeClass));
            }
        });
    }

    return result;
}

module.exports = getDomObjects;
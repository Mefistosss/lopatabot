const getObjectValueByClass = require('./getObjectValueByClass.js');

let getDomObjects = function (body, nodeClass) {
    let result = [], r;

    if (body.childNodes && body.childNodes.length) {
        r = new RegExp('\\b' + nodeClass + '\\b');
        body.childNodes.forEach((node) => {
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
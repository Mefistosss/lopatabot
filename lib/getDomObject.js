const getObjectValueByClass = require('./getObjectValueByClass.js');

module.exports = function (body, nodeClass) {
    let result = [], r;
console.log(body);
    if (body.childNodes && body.childNodes.length) {
        r = new RegExp(nodeClass);
        body.childNodes.forEach((node) => {
            if (r.test(getObjectValueByClass(node.attrs))) {
                result.push(node);
            } else {
                result = result.concat(getDivs(node, nodeClass));
            }
        });
    }

    return result;
}

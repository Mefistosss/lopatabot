var getAttr = require('./getAttr.js');

module.exports = function (attrs, nameOfClass) {
    var result = false,
        reg = new RegExp('(^| )' + nameOfClass + '( |$)'),
        obj = getAttr(attrs, 'class');

    if (obj && reg.test(obj)) {
        result = true;
    }

    return result;
}

module.exports = function (attrs, nameOfAttr) {
    var i, l = attrs ? attrs.length : 0, result = null;

    for (i = 0; i < l; i++) {
        if (attrs[i].name === nameOfAttr) {
            result = attrs[i].value;
            break;
        }
    }

    return result;
}

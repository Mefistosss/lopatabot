module.exports = function (attrs) {
    let i, l = attrs ? attrs.length : 0, result = null;

    for (i = 0; i < l; i++) {
        if (attrs[i].name === 'class') {
            result = attrs[i].value;
            break;
        }
    }

    return result;
}

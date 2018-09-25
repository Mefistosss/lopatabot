
module.exports = function (arr, nameOfTag) {
    var i, result = null;

    if (!arr) { arr = []; }

    for (i = 0; i < arr.length; i++) {
        if (arr[i].tagName && arr[i].tagName.toLowerCase() === nameOfTag) {
            result = arr[i];
            break;
        }
    }

    return result;
}

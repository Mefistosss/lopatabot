
module.exports = function (arr, nameOfTag) {
    var i, result = null;

    if (!arr) { arr = []; }
// console.log('arr.length',arr.length);
    for (i = 0; i < arr.length; i++) {
        if (arr[i].tagName.toLowerCase() === nameOfTag) {
            result = arr[i];
            break;
        }
    }

    return result;
}

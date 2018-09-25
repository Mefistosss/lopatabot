var BLOCK_TIME = 20000;
var storage = {};

module.exports = function(id) {
    var result = false,
        now = +new Date();

    if (!storage[id]) {
        storage[id] = now;
        result = true;
    } else {
        if (now - storage[id] >  BLOCK_TIME) {
            result = true;
        }

        storage[id] = now;
    }

    return result;
};
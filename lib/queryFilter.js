var BLOCK_TIME = 20000;
var PRIVATE_BLOCK_TIME = 5000;
var storage = {};

module.exports = {
    check: function(id, group, typeOfChat) {
        var result = false,
            now = +new Date(),
            bt = (typeOfChat === 'private') ? PRIVATE_BLOCK_TIME : BLOCK_TIME;

        if (!storage[group]) {
            storage[group] = {};
        }

        if (!storage[group][id]) {
            result = true;
        } else {
            if (now - storage[group][id] >  bt) {
                result = true;
            }
        }
        storage[group][id] = now;

        return result;
    },

    clear: function () {
        storage = {};
    }
};
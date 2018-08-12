
var storage = {};

module.exports = {
    check: function(id, type) {
        var result = false;

        if (type === 'group') {
            if (!storage[id]) {
                storage[id] = true;    
            }
        } else {
            result = true;
        }

        return result;
    },

    clear: function () {
        storage = {};
    }
};

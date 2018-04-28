function getQueue (ids) {
    var count = 45,
        currentCount = 0,
        arr, l = ids.length,
        result = [];

    ids.forEach(function (id, index) {
        if (currentCount === 0) { arr = []; }

        currentCount += 1;
        arr.push(id);

        if (currentCount === count || index === l - 1) {
            if (currentCount === count) {
                currentCount = 0;
            }

            result.push(arr);
        }
    });

    return result;
}

module.exports = function(ids, callbackOfSend, callbackOfEnd) {
    var queue = getQueue(ids);
        makeQueue = function () {
            var q = queue.shift();

            if (q) {
                callbackOfSend(q);
                setTimeout(function () {
                    makeQueue();
                }, 1000);
            } else {
                callbackOfEnd();
            }
        };

    makeQueue();
};

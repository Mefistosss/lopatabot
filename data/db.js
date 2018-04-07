var mongoose = require('./mongoose.js');
mongoose.set('debug', process.env.NODE_ENV === 'development');
var async = require('async');

function open(callback) {
    mongoose.connection.on('open', callback);
}

function requireModels(callback) {
    require('./models/room');

    async.each(Object.keys(mongoose.models), function(modelName, _callback) {
        mongoose.models[modelName].ensureIndexes(_callback);
    }, callback);
}
module.exports = function(callback) {
    async.series([
        open,
        requireModels
    ], function(err) {
        if (err) throw err;
        // mongoose.disconnect();
        callback();
    });
};
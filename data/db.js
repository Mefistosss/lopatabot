var mongoose = require('./mongoose.js');
// mongoose.set('debug', process.env.NODE_ENV === 'development');
var async = require('async');

function open(callback) {
    mongoose.connection.on('open', function () {
        console.log('MongoDB open');

        mongoose.connection.on('connected', function() {
            console.log('MongoDB event connected');
        });

        mongoose.connection.on('disconnected', function() {
            console.log('MongoDB event disconnected');
        });

        mongoose.connection.on('reconnected', function() {
            console.log('MongoDB event reconnected');
        });

        mongoose.connection.on('error', function(err) {
            console.log('MongoDB event error: ' + err);
        });

        callback();
    });
}

function requireModels(callback) {
    require('./models/room');
    require('./models/hashdata');

    async.each(Object.keys(mongoose.models), function(modelName, _callback) {
        mongoose.models[modelName].ensureIndexes(_callback);
    }, callback);
}
module.exports = function(callback) {
    async.series([
        open,
        requireModels
    ], function(err) {
        if (err) {
            console.log("MONGOOSE", err);
        }
        // mongoose.disconnect();
        callback(err);
    });
};
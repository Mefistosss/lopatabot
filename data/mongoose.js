'use strict';

var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000
    // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0
};
var mongoURLLabel, mongoURL = null;

if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    }
} else {
    mongoURL = 'mongodb://' + config.get('mongoUrl') + ':' + config.get('mongoPort') + '/' + config.get('mongoName');
    mongoURLLabel = mongoURL;
}

console.log('MONGOURL', mongoURLLabel);
console.log('MONGOOPTIONS', options);
mongoose.connect(mongoURL, options);

module.exports = mongoose;

'use strict';

var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var options = ['keepAlive=true', 'autoReconnect=true', 'reconnectTries=50', 'reconnectInterval=2000'];
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
    mongoURL = 'mongodb://' + config.get('mongoUrl') + config.get('mongoName');
    mongoURLLabel = mongoURL;
}

mongoURL = mongoURL + '?' + options.join('&');

console.log('MONGOURL', mongoURLLabel);
console.log('MONGOOPTIONS', options);
mongoose.connect(mongoURL);

module.exports = mongoose;

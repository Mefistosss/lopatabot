var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var user = null;
var password = null;

var mongoUrl = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL || process.env.MONGOURL;
var name = process.env.MONGONAME || config.get('mongoName');

var options = {
    "keepAlive": true
};

if (mongoUrl == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD']
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        // mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            // mongoURL += mongoUser + ':' + mongoPassword + '@';

            options.user = mongoUser;
            options.pass = mongoPassword;

            console.log('USER PASS: true');
        }
        // Provide UI label that excludes user id and pw
        // mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        // mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
        mongoURL = mongoHost + ':' +  mongoPort;
        name = mongoDatabase;
    }
}

if (mongoUrl == null) {
    mongoUrl = config.get('mongoUrl');
}

console.log('MONGOURL', 'mongodb://' + mongoUrl + '/' + name);

mongoose.connect('mongodb://' + mongoUrl + '/' + name, options);

module.exports = mongoose;

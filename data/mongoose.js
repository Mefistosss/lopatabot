var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var user = null;
var password = null;

// var mongoUrl = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL || process.env.MONGOURL;
// var name = process.env.MONGODB_DATABASE || process.env.MONGODB_NAME || process.env.MONGO_NAME || config.get('mongoName');
var name = process.env.MONGODB_DATABASE;

var options = {
    "keepAlive": true,
    "autoReconnect": true,
    "reconnectTries": 50,
    "reconnectInterval": 2000
};

// if (mongoUrl == null && process.env.DATABASE_SERVICE_NAME) {
//     var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//         mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//         mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//         mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//         mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//         mongoUser = process.env[mongoServiceName + '_USER'];

//     if (mongoHost && mongoPort && mongoDatabase) {
//         // mongoURLLabel = mongoURL = 'mongodb://';
//         if (mongoUser && mongoPassword) {
//             // mongoURL += mongoUser + ':' + mongoPassword + '@';

//             options.user = mongoUser;
//             options.pass = mongoPassword;

//             console.log('USER PASS: true');
//         }
//         // Provide UI label that excludes user id and pw
//         // mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//         // mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//         mongoURL = mongoHost + ':' +  mongoPort;
//         name = mongoDatabase;
//     }
// }

options.user = process.env.MONGODB_USER;
options.pass = process.env.MONGODB_PASSWORD;

mongoHost = process.env.MONGODB_SERVICE_HOST || process.env.MONGODB_HOST;
mongoPort = process.env.MONGODB_SERVICE_PORT || process.env.MONGODB_PORT;

console.dir(process.env);
mongoUrl = mongoHost + ':' +  mongoPort;

// if (mongoUrl == null) {
//     mongoUrl = config.get('mongoUrl');
// }


// mongoUrl = 'mongodb://' + mongoUrl + '/' + name;
mongoUrl = mongoUrl + '/' + name;

// console.log('MONGOURL', mongoUrl, options);
// mongoose.connect(mongoUrl, options, function (err) {
//     if (err) {
//         console.log('connect error');
//         console.log(err);
//     } else {
//         console.log('mongoose is connected');
//     }
// });


// var user = process.env.MONGODB_USER;
// var pass = process.env.MONGODB_PASSWORD;

// mongoUrl = 'mongodb://' + user + ':' + pass + '@' + mongoHost + ':' + mongoPort + '/' + name;
// console.log('MONGOURL', mongoUrl);

// mongoose.connect(mongoUrl);

// var MongoDB = mongoose.connect(mongoUrl).connection;
// MongoDB.on('error', function(err) {
//     console.log(err.message);
// });

// MongoDB.once('open', function() {
//     console.log("mongodb connection open");
// });





mongoURL = null;
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
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
}

// mongoUrl = 'mongodb://' + mongoURL;

console.log('MONGOURL', mongoURL);
// mongoose.connect(mongoURL, function (err) {
//     if (err) {
//         console.log('connect error');
//         console.log(err);
//     } else {
//         console.log('mongoose is connected');
//     }
// });

mongoose.connect(mongoURL);




module.exports = mongoose;

var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongoUrl = process.env.MONGOURL || config.get('mongoUrl');
var name = process.env.MONGONAME || config.get('mongoName');

console.log(mongoUrl + name);

mongoose.connect('mongodb://' + mongoUrl + '/' + name, {
    "server": {
        "socketOptions": {
            "keepAlive": 1
        }
    }
});

module.exports = mongoose;

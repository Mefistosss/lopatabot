var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongoUrl = process.env.MONGOURL || config.get('mongoUrl');
var name = process.env.MONGONAME || config.get('mongoName');

mongoose.connect('mongodb://' + mongoUrl + '/' + name, {
    "keepAlive": true
});

module.exports = mongoose;

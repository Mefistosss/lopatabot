var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    dataType: {
        type: String,
        unique: true,
        required: true
    },

    hashData: {
        type: String,
        unique: false,
        required: true
    },

    timeDate: {
        type: Date,
        unique: false,
        required: false
    }
});

exports.HashData = mongoose.model("HashData", schema);

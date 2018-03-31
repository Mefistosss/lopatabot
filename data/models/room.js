var mongoose = require('../mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    room_id: {
        type: String,
        unique: true,
        required: true
    },

    room_type: {
        type: String,
        unique: false,
        required: true
    },

    first_name: {
        type: String,
        unique: false,
        required: false
    },

    last_name: {
        type: String,
        unique: false,
        required: false
    },

    username: {
        type: String,
        unique: false,
        required: false
    },

    title: {
        type: String,
        unique: false,
        required: false
    }
});

exports.Room = mongoose.model("Room", schema);

var cron = require('cron');
var config = require('config');
var Room = require('../data/models/room').Room;
var isEmptyString = require('../lib/isEmptyString.js');
var getSubscribeMessage = require('../lib/getSubscribeMessage.js');

function getIds (callback) {
    var result = [];

    Room.find({}, function(err, rooms) {
        if (!err) {
            rooms.forEach(function(room) {
                result.push(room.room_id);
            });    
        }
        
        callback(result);
    });
}

var Groups = function (tickCallback) {
    this.tickCallback = tickCallback;

    var self = this;

    try {
        this.job = new cron.CronJob({
            cronTime: config.get('jobTime'),
            onTick: function () {
                getIds(function (ids) {
                    if (ids.length) {
                        self.tickCallback(ids);
                    }
                });
            },
            start: false,
            timeZone: 'Europe/Kiev'
        });
    } catch(ex) {}
};

Groups.prototype.add = function (data, callback) {
    var room, name, message = '',
        roomData = { room_id: data.id, room_type: data.type };

    Room.find({ room_id: data.id }, function (err, rooms) {
        if (!err) {
            if (rooms.length) {
                callback(err, message);
            } else {
                switch(data.type) {
                    case 'private':
                        if (!isEmptyString(data.first_name)) {
                            roomData.first_name = data.first_name;
                            name = data.first_name;
                        }

                        if (!isEmptyString(data.last_name)) {
                            roomData.last_name = data.last_name;
                        }

                        if (!isEmptyString(data.username)) {
                            roomData.username = data.username;
                            if (!name) {
                                name = data.username;
                            }
                        }
                        break;
                    case 'group':
                        if (!isEmptyString(data.title)) {
                            roomData.title = data.title;
                        }
                        break;
                }

                room = new Room(roomData);
                room.save(function (_err) {
                    if (!_err) {
                        message = getSubscribeMessage({
                            type: data.type,
                            isAdded: true,
                            name: name
                        });
                    }
                    callback(err, message);
                });
            }
        } else {
            callback(err, message);
        }
    });
};

Groups.prototype.remove = function (id, callback) {
    var message = '', name = '';

    Room.find({ room_id: id }, function(err, rooms) {
        if (!err, rooms.length) {
            if (rooms[0].room_type === 'private') {
                name = !isEmptyString(rooms[0].first_name) ? rooms[0].first_name : rooms[0].username;
            }

            message = getSubscribeMessage({
                type: rooms[0].room_type,
                isAdded: false,
                name: name
            });
        }
        Room.remove({ room_id: id }, function (_err) {
            callback(err, message);
        });
    });
};

Groups.prototype.startJob = function () {
    if (!this.job.running) {
        this.job.start();
    }
};
    
Groups.prototype.stopJob = function () {
    if (this.job.running) {
        this.job.stop();
    }
};

module.exports = Groups;


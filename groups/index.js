var cron = require('cron');
var config = require('config');
var Room = require('../data/models/room').Room;
var isEmptyString = require('../lib/isEmptyString.js');
var getSubscribeMessage = require('../lib/getSubscribeMessage.js');

function getIds (callback) {
    var result = {
        private: [],
        group: []
    };

    Room.find({}, function(err, rooms) {
        if (!err) {
            rooms.forEach(function(room) {
                if (!!room.title) {
                    result.group.push({
                        id: room.room_id
                    });
                } else {
                    result.private.push({
                        id: room.room_id,
                        name: room.first_name || room.username
                    });
                }
            });    
        }
        
        callback(result);
    });
}

var Groups = function (tickCallback) {
    this.tickCallback = tickCallback;

    var self = this;
    this.job1 = null;
    this.job2 = null;

    try {
        this.job1 = new cron.CronJob({
            cronTime: config.get('jobTime1'),
            onTick: function () {
                self.send('morning');
            },
            start: false,
            timeZone: 'Europe/Kiev'
        });
    } catch(ex) {}

    try {
        this.job2 = new cron.CronJob({
            cronTime: config.get('jobTime2'),
            onTick: function () {
                self.send('bashcomics');
            },
            start: false,
            timeZone: 'Europe/Kiev'
        });
    } catch(ex) {}
};

Groups.prototype.send = function (type) {
    var self = this;
    getIds(function (ids) {
        if (ids.private.length || ids.group.length) {
            self.tickCallback(ids, type);
        }
    });
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
    if (this.job1 !== null && !this.job1.running) {
        this.job1.start();
    }

    if (this.job2 !== null && !this.job2.running) {
        this.job2.start();
    }
};
    
Groups.prototype.stopJob = function () {
    if (this.job1 !== null && this.job1.running) {
        this.job1.stop();
    }

    if (this.job2 !== null && this.job2.running) {
        this.job2.stop();
    }
};

module.exports = Groups;


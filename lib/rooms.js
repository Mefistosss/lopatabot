var fs = require('fs');
var config = require('config');

var file = config.get('roomsFile');

var Rooms = function () {
    this.rooms = [];
    this.queue = [{type: 'read'}];
    this.isBusy = false;
};

Rooms.prototype.check = function (room) {
    var i, result = false;

    for (i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i] === room) {
            result = true;
            break;
        }
    }

    return result;
};

Rooms.prototype.read = function (callback) {
    var arr, self = this;

    fs.readFile(file, 'utf8', function (err, data) {
        if (!err) {
            arr = data.split(',');
            if (arr[0] === '') {
                arr.shift();
            }
            self.rooms = arr;
        }
        callback();
    });
};
    
Rooms.prototype.write = function (arr, callback) {
    var self = this;
    fs.open(file, "w+", '0666', function (err, file_handle) {
        if (!err) {
            fs.write(file_handle, arr.join(','), null, function (_err, written) {
                if (!_err) {
                    self.rooms = arr;
                    fs.close(file_handle);
                    callback();
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
    });
};

Rooms.prototype.doAction = function () {
    var arr, self = this;

    if (this.queue.length && !this.isBusy) {
        var action = this.queue.shift();
        this.isBusy = true;
        switch (action.type) {
            case 'read':
                this.read(function () {
                    if (action.fn) {
                        action.fn(JSON.parse(JSON.stringify(self.rooms)));
                    }
                    self.isBusy = false;
                    self.doAction();
                });
                break;
            case 'add':
                if (!this.check(action.data)) {
                    arr = JSON.parse(JSON.stringify(this.rooms));
                    arr.push(action.data);
                    this.write(arr, function () {
                        self.isBusy = false;
                        self.doAction();
                    });
                } else {
                    this.isBusy = false;
                    this.doAction();
                }
                break;
            case 'remove':
                if (this.check(action.data)) {
                    arr = JSON.parse(JSON.stringify(this.rooms));
                    arr.splice(arr.indexOf(action.data), 1);
                    this.write(arr, function () {
                        self.isBusy = false;
                        self.doAction();
                    });
                } else {
                    this.isBusy = false;
                    this.doAction();
                }
                break;
        }
    }
};

Rooms.prototype.getRooms = function (callback) {
    this.queue.push({
        type: 'read',
        fn: callback
    });
    this.doAction();
};

Rooms.prototype.addRoom = function (room) {
    this.queue.push({
        type: 'add',
        data: room
    });

    this.doAction();
};
    
Rooms.prototype.removeRoom = function (room) {
    this.queue.push({
        type: 'remove',
        data: room
    });

    this.doAction();
};

var rooms = new Rooms();

module.exports = rooms;

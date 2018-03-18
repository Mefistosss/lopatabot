const fs = require('fs');
const config = require('config');

const file = config.get('roomsFile');

class Rooms {
    constructor () {
        this.rooms = [];
        this.queue = [{type: 'read'}];
        this.isBusy = false;
    }

    check (room) {
        let i, result = false;
    
        for (i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i] === room) {
                result = true;
                break;
            }
        }
    
        return result;
    }

    read (callback) {
        let arr;

        fs.readFile(file, 'utf8', (err, data) => {
            if (!err) {
                arr = data.split(',');
                if (arr[0] === '') {
                    arr.shift();
                }
                this.rooms = arr;
            }
            callback();
        });
    }
    
    write (arr, callback) {
        fs.open(file, "w+", '0666', (err, file_handle) => {
            if (!err) {
                fs.write(file_handle, arr.join(','), null, (_err, written) => {
                    if (!_err) {
                        this.rooms = arr;
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
    }
    
    doAction () {
        let arr;
        if (this.queue.length && !this.isBusy) {
            let action = this.queue.shift();
            this.isBusy = true;
            switch (action.type) {
                case 'read':
                    this.read(() => {
                        if (action.fn) {
                            action.fn(JSON.parse(JSON.stringify(this.rooms)));
                        }
                        this.isBusy = false;
                        this.doAction();
                    });
                    break;
                case 'add':
                    if (!this.check(action.data)) {
                        arr = JSON.parse(JSON.stringify(this.rooms));
                        arr.push(action.data);
                        this.write(arr, () => {
                            this.isBusy = false;
                            this.doAction();
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
                        this.write(arr, () => {
                            this.isBusy = false;
                            this.doAction();
                        });
                    } else {
                        this.isBusy = false;
                        this.doAction();
                    }
                    break;
            }
        }
    }
    
    getRooms (callback) {
        this.queue.push({
            type: 'read',
            fn: callback
        });
        this.doAction();
    }
    
    addRoom (room) {
        this.queue.push({
            type: 'add',
            data: room
        });
    
        this.doAction();
    }
    
    removeRoom (room) {
        this.queue.push({
            type: 'remove',
            data: room
        });
    
        this.doAction();
    }
}

let rooms = new Rooms();

module.exports = rooms;

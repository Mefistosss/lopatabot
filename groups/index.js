var cron = require('cron');
var config = require('config');
var rooms = require('../lib/rooms.js');

var Groups = function (tickCallback) {
    this.tickCallback = tickCallback;

    var self = this;

    try {
        this.job = new cron.CronJob({
            cronTime: config.get('jobTime'),
            onTick: function () {
                rooms.getRooms(function (ids) {
                    self.tickCallback(ids);
                });
            },
            start: false,
            timeZone: 'Europe/Kiev'
        });
    } catch(ex) {}
};

Groups.prototype.add = function (id) {
    rooms.addRoom(id);
};

Groups.prototype.remove = function (id) {
    rooms.removeRoom(id);
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


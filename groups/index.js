const cron = require('cron');
const config = require('config');
const rooms = require('../lib/rooms.js');

module.exports = class Groups {
    constructor (tickCallback) {
        this.tickCallback = tickCallback;

        let self = this;

        try {
            this.job = new cron.CronJob({
                cronTime: config.get('jobTime'),
                onTick: () => {
                    rooms.getRooms((ids) => {
                        self.tickCallback(ids);
                    });
                },
                start: false,
                timeZone: 'Europe/Kiev'
            });
        } catch(ex) {}
    }

    add (id) {
        rooms.addRoom(id);
    }
    
    remove (id) {
        rooms.removeRoom(id);
    }
    
    startJob () {
        if (!this.job.running) {
            this.job.start();
        }
    }
    
    stopJob () {
        if (this.job.running) {
            this.job.stop();
        }
    }
}

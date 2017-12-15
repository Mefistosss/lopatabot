const cron = require('cron');
const config = require('config');

module.exports = class Groups {
    constructor (tickCallback) {
        this.tickCallback = tickCallback;
        this.groupsIds = [];

        try {
            this.job = new cron.CronJob({
                cronTime: config.get('jobTime'),
                onTick: () => {
                    this.tickCallback(this.groupsIds);
                },
                start: false,
                timeZone: 'Europe/Kiev'
            });
        } catch(ex) {}
    }

    add (id) {
        if (this.groupsIds.indexOf(id) === -1) {
            this.groupsIds.push(id);
        }
    }
    
    remove (id) {
        let index = this.groupsIds.indexOf(id);
    
        if (index !== -1) {
            this.groupsIds.splice(index, 1);
        }
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

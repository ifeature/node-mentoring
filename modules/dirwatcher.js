const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const EVENTS = Object.freeze({
    CHANGED: 'dirwatcher:changed',
});

function debounce(fn, delay) {
    let delayed = false;
    return function(...args) {
        if (delayed) return;

        fn.apply(this, args);

        delayed = true;
        setTimeout(() => {
            delayed = false;
        }, delay);
    };
}

function getFilename(filename) {
    const pattern = /___jb_tmp___|___jb_old___$/;
    return filename.split(pattern)[0];
}

class DirWatcher extends EventEmitter {
    watch(path, delay) {
        fs.watch(path, { recursive: true, }, debounce((eventType, filename) => {
            this.emit(EVENTS.CHANGED, path, getFilename(filename));
        }, delay));
    }
}

module.exports = DirWatcher;
module.exports.EVENTS = EVENTS;
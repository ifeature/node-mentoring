const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

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
            // console.log('!!!! ', filename);
            this.emit('dirwatcher:changed', path, getFilename(filename));
        }, delay));
    }
}

module.exports = DirWatcher;
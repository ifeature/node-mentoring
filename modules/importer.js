const fs = require('fs');
const promisify = require('util').promisify;
// const DirWatcher = require('./dirwatcher');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

function csvToJson(file) {
    const contents = file.contents;
    const json = [];
    const rows = contents.split('\n');
    const headings = rows.splice(0, 1)[0].split(',');
    // console.log(headings);

    const newContents = rows.map((row, index) => {
        const rowArr = row.split(/,|(".+")/).filter(Boolean);
        const obj = {};
        headings.map((heading, index) => {
            //console.log(heading);
            obj[heading] = rowArr[index];
        });
        return obj;
    });


    return JSON.stringify({
        fileName: file.fileName,
        contents: newContents,
    });
}


class Importer {
    constructor(dirwatcher) { // dirwatcher instance
        this.init(dirwatcher);
        this.bindEvents();
    }

    init(dirwatcher) {
        this.dir = {};
        this.dirwatcher = dirwatcher;
    }

    bindEvents() {
        this.dirwatcher.on('dirwatcher:changed', (path, fileName) => {
            readdir(path)
                .then(files => Promise.all(files.map(file => {
                    return readFile(`${path}/${file}`, 'utf-8').then(d => ({ fileName: file, contents: d }));
                })))
                .then(data => {
                    this.dir[path] = data;
                })
                .catch(e => console.log(e));
        });
    }

    import(path) {
        return new Promise(resolve => {
            setImmediate(() => {
                let dir;
                this.dir[path] ? resolve(this.dir[path].map(csvToJson)) : resolve(JSON.stringify([]))
            });
        });
    }

    importSync(path) {
        return this.dir[path] ? this.dir[path].map(csvToJson) : JSON.stringify([]);
    }
}

module.exports = Importer;

const fs = require('fs');
import csv from 'fast-csv';
const promisify = require('util').promisify;

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

class Importer {
    constructor(dirWatcher) {
        this.init(dirWatcher);
    }

    init(dirWatcher) {
        this.files = {};
        this.dirWatcher = dirWatcher;
    }

    listen(eventName) {
        this.dirWatcher.on(eventName, (path, fileName) => {
            this.import('data').then(files => {
                this.files = files;
                console.log('files: ', files);
            });
            // this.files = this.importSync('data');
        });
    }

    import(path) {
        return readDir(path)
            .then(fileNames => Promise.all(fileNames
                .map(file => new Promise((resolve, reject) => {
                    const csvFile = [];
                    const csvStream = fs.createReadStream(`${path}/${file}`);

                    csv.fromStream(csvStream, { headers: true })
                        .on('data', data => csvFile.push(data))
                        .on('end', () => resolve(csvFile))
                        .on('error', error => reject(error));
                }))))
            .then(files => JSON.stringify(files));
    }

    importSync(path) {
        const loadedFiles = [];
        const fileNames = fs.readdirSync(path);
        fileNames.forEach((file) => {
            const csvFile = fs.readFileSync(`${path}/${file}`)
                .toString()
                .split('\n')
                .map((csvString) => {
                    const [id, name, brand, company, price, isbn] = csvString.split(',');
                    return {
                        id, name, brand, company, price, isbn,
                    };
                });
            loadedFiles.push(csvFile);
        });
        return JSON.stringify(loadedFiles);
    }
}

module.exports = Importer;

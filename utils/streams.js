'use strict';

const promisify = require('util').promisify;
const fs = require('fs');
const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const through = require('through2');
const csv = require('csvtojson');
const request = require('request');

const HELP = 'help';
const ACTION ='action';
const FILE ='file';
const PATH ='path';

const argv = require('minimist')(process.argv.slice(2), {
    alias: {
        h: HELP,
        a: ACTION,
        f: FILE,
        p: PATH,
    },
});

function inputOutput(path) {
    fs.createReadStream(path).pipe(process.stdout);
}

function transformUpperCase() {
    function write(buffer, encoding, next) {
        this.push(buffer.toString().toUpperCase());
        next();
    }

    function end(done) {
        done();
    }

    const stream = through(write, end);

    process.stdin.pipe(stream).pipe(process.stdout);
}

function transformCSV(path) {
    fs.createReadStream(path)
        .pipe(through((chunk, encoding, next) => {
            csv().fromString(chunk.toString()).on('json',(json)=> {
                this.push(JSON.stringify(json));
            });

            next();
        }))
        .pipe(process.stdout);
}

function transformCSVFile(path) {
    const fileName = path.split('.')[0];
    fs.createReadStream(path)
        .pipe(through((chunk, encoding, next) => {
            csv().fromString(chunk.toString()).on('json', (json) => {
                this.push(JSON.stringify(json));
            });

            next();
        }))
        .pipe(fs.createWriteStream(`${fileName}.json`));
}

function bundleCSS(directory) {
    const output = `${directory}/bundle.css`;
    const CSS = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';
    const result = [];

    readDir(directory)
        .then(fileNames => Promise.all(
            fileNames.map(file => new Promise((resolve, reject) => {
                const stream = fs.createReadStream(`${directory}/${file}`).pipe(through((chunk, encoding, next) => {
                    result.push(chunk.toString());
                    next();
                    resolve();
                }));

                stream.on('error', reject).on('end',resolve);
            }))
        ))
        .then(() => {
            return fetchFile(CSS);
        })
        .then(data => {
            result.push(data);
            return writeFile(output, result.join('\n'));
        })
        .catch(error => {
            console.log(error);
        });
}

function printHelpMessage(action) {
    if (action) {
        console.log(`Action with ${action} value is unspecified`);
    } else {
        console.log('Default help tip');
    }
}

function fetchFile(fileName) {
    return new Promise((resolve, reject) => {
        request(fileName, (error, response, body) => {
            if (error) {
                return reject(error);
            }

            resolve(body);
        });
    });
}

function processAction(action, file, path, help) {
    if ((!action && !file && !help) || help) return printHelpMessage();

    console.log("ACTION");
    switch(action) {
        case 'io':
            return inputOutput(file);
        case 'transform-uppercase':
            return transformUpperCase(file);
        case 'transform-csv':
            return transformCSV(file);
        case 'transform-csv-file':
            return transformCSVFile(file);
        case 'bundle-css':
            return bundleCSS(path);
        default:
            return printHelpMessage(action);

    }
}

const action = argv[ACTION];
const file = argv[FILE];
const help = argv[HELP];
const path = argv[PATH];

processAction(action, file, path, help);

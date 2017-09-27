'use strict';

const fs = require('fs');
const appName = require('./config/json').name;
const models = require('./models');
const DirWatcher = require('./modules/dirwatcher');
const Importer = require('./modules/importer');

const DATA_PATH = './data';
const dirwatcher = new DirWatcher();
const importer = new Importer(dirwatcher);

dirwatcher.watch(DATA_PATH);

setTimeout(() => {
    console.log(importer.importSync('./data'));
    importer.import(DATA_PATH).then(res => {
        // console.log(res);
        // for testing
        fs.writeFile('./out/test.json', res, (err, res) => {
            if (err) {
                return console.log(err);
            }
            console.log(res);
        });
    });
}, 5000);









console.log(appName);

const user = new models.UserModel();
const product = new models.ProductModel();


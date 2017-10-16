'use strict';

const fs = require('fs');
const cp = require('child_process');
const appName = require('./config/config').name;
const models = require('./models');
const DirWatcher = require('./modules/dirwatcher');
const EVENTS = require('./modules/dirwatcher').EVENTS;
const Importer = require('./modules/importer');

const DATA_PATH = './data';
const dirWatcher = new DirWatcher();
const importer = new Importer(dirWatcher);

dirWatcher.watch(DATA_PATH);
importer.listen(EVENTS.CHANGED);

console.log(appName);

const user = new models.UserModel();
const product = new models.ProductModel();

const args = process.argv.slice(4);
const child = cp.fork('./utils/streams.js', args);

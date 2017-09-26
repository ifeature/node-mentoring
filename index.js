'use strict';

require('babel-register')({
    presets: ['es2015', 'stage-2']
});

const appName = require('./config/json').name;
const models = require('./models');

console.log(appName);

const user = new models.UserModel();
const product = new models.ProductModel();


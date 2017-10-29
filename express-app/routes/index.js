'use strict';

const fs = require('fs');
const products = require('../products.json');
const users = require('../users.json');

module.exports = (router) => {
    router.get('/api/users', (req, res, next) => {
        res.json(users);
    });

    router.get('/api/products', (req, res, next) => {
        res.json(products);
    });

    router.post('/api/products', (req, res, next) => {
        products.push(req.body);
        fs.createWriteStream(__dirname + '/../products.json').write(JSON.stringify(products));
        res.json(req.body);
    });

    router.param('id', (req, res, next, id) => {
        req.product = products.find(_ => _.id === +id);
        next();
    });

    router.get('/api/products/:id', (req, res, next) => {
        res.json(req.product);
    });

    router.get('/api/products/:id/reviews', (req, res, next) => {
        res.json(req.product.reviews);
    });

    return router;
};
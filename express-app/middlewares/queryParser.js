'use strict';

const url = require('url');

function createQueryParser() {
    return (req, res, next) => {
        req.parsedQuery = url.parse(req.url, true).query;
        next();
    };
}

module.exports = createQueryParser;
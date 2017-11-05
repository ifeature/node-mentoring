'use strict';

function createCookieParser() {
    return (req, res, next) => {
        const cookie = req.headers.cookie;
        if (!cookie) {
            req.parsedCookies = {};
            next();
        } else {
            req.parsedCookies = cookie
                .split(';')
                .map(_ => _.trim())
                .reduce((acc, next) => {
                    const [key, value] = next.split('=');
                    acc[key] = value;
                    return acc;
                }, {});
            next();
        }
    };
}

module.exports = createCookieParser;
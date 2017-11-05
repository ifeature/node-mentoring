'use strict';

const jwt = require('jsonwebtoken');

function createRequireAuth(config) {
    return (req, res, next) => {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
               if (err) {
                   res.json({ success: false, message: 'Failed to authenticate token.' });
               } else {
                   // find user by subject
                   req.user = {
                       email: decoded.sub
                   };
                   next();
               }
            });
        } else {
            res.status(403).send({ success: false, message: 'No token provided.' });
        }
    };
}

module.exports = createRequireAuth;

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
                   /**
                    * Find user by subject
                    *
                    * In our app it is not necessary to patch the Request by user,
                    * we won't use that information, but, it can be really handy.
                    *
                    * For instance, if we're logged in user make such kind of request
                    * /api/products/reviews
                    * he might be want to retrieve all reviews, that have been written by her
                    */
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

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const requireAuth = require('../middlewares/requireAuth');
const products = require('../products.json');
const users = require('../users.json');

const user = {
    email: 'admin@example.com',
    username: '123',
};

const config = {
    secret: 'secret'
};

const generateToken = (user) => {
  return jwt.sign({ sub: user.email, iat: new Date().getTime() }, config.secret, { expiresIn: 100 });
};

const FACEBOOK_APP_ID = '1845831708763522';
const FACEBOOK_APP_SECRET = '793abf2fa86402527d90e9fbafc42f1d';

const TWITTER_CONSUMER_KEY = 'mQRYwM4Tor83XjfjUeTCwJWcH';
const TWITTER_CONSUMER_SECRET = 'GIFYiRwROeWabxAZnw4g1eJwyj5cSskOlflcRTgMRmGevvQhhC';

const GOOGLE_CONSUMER_KEY = '638197367712-820e13joc6php9mj6lkg05bl8uioej57.apps.googleusercontent.com';
const GOOGLE_CONSUMER_SECRET = 'Rzdu0CCTq75-lyj1IdgnApOV';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    // profileFields: ['emails']
}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);
    done(null, user);
}));

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:8080/auth/twitter/callback',
}, (token, tokenSecret, profile, done) => {
    console.log(token, tokenSecret, profile);
    done(null, user);
}));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CONSUMER_KEY,
    clientSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback',
}, (token, tokenSecret, profile, done) => {
    console.log(token, tokenSecret, profile);
    done(null, user);
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'username'
}, (email, username, done) => {
    if (!email || email !== user.email || !username || username !== user.username) {
        done(null, false, 'Bad username/password combination');
    } else {
        done(null, user);
    }
}));

module.exports = (router) => {
    router.get('/auth/facebook', passport.authenticate('facebook', { session: false }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
        res.send('Hello, FB auth');
    });

    router.get('/auth/twitter', passport.authenticate('twitter', { session: false }));
    router.get('/auth/twitter/callback', passport.authenticate('twitter', { session: false }), (req, res) => {
        res.send('Hello, TWITTER auth');
    });

    router.get('/auth/google', passport.authenticate('google',  { scope: ['https://www.googleapis.com/auth/plus.login'], session: false }));
    router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
        res.send('Hello, GOOGLE auth');
    });

    router.post('/auth', (req, res, next) => {
        if (req.body.email !== user.email) {
            res.status(403).json({
                code: 404,
                message: 'Not Found',
            });
        } else {
            res.json({
                code: 200,
                message: 'OK',
                data: {
                    user: {
                        email: user.email,
                        username: user.username
                    }
                },
                token: generateToken(user)
            });
        }
    });

    router.post('/authenticate', passport.authenticate('local', { session: false }), (req, res, next) => {
        res.json({
            code: 200,
            message: 'OK',
            data: {
                user: {
                    email: req.user.email,
                    username: req.user.username
                }
            },
            token: generateToken(user)
        });
    });

    router.get('/api/users', requireAuth(config), (req, res, next) => {
        res.json(users);
    });

    router.get('/api/products', requireAuth(config), (req, res, next) => {
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
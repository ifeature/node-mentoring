'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('./middlewares/cookieParser');
const queryParser = require('./middlewares/queryParser');
const routes = require('./routes');
const app = express();
const router = express.Router();

app.use(session({
    secret: 'nodeJS',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(cookieParser());
app.use(queryParser());
app.use(express.json());

app.use(routes(router));

app.use((req, res, next) => {
   console.log(req.parsedCookies);
   console.log(req.parsedQuery);
});

module.exports = app;
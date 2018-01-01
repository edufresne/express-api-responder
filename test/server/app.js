var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var defaultRouter = require('./routes/default');
var optsRouter = require('./routes/opts');

app.use('/', defaultRouter);
app.use('/opts', optsRouter);

module.exports = app;

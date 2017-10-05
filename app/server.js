#!/usr/bin/env node
var express = require('express'),
        cors = require('cors'),
        path = require('path');

//controllers
var weather = require('./controllers/weather');

//application
var app = express();

app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodiess

//routes
app.use('/weather', weather);

//public files
app.use(express.static(path.join(__dirname, '/../public')));

app.listen(8000);
module.exports = app;

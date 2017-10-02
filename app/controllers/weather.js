var express = require('express'),
	router  = express.Router(),
	Weather = require('../models/Weather'),
	global  = require('../global');

router.get('/', function(req, res, next){

	Weather.getWeather(function(weather){
		console.log(weather);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(weather));
	})
});

module.exports = router;

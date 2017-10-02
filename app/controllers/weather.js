var express = require('express'),
	router  = express.Router(),
	Weather = require('../models/Weather'),
	global  = require('../global');

router.get('/weather', function(req, res, next){

	Weather.getWeather(function(weather){
		res.render('weather', {weather: weather});
	})
});

module.exports = router;

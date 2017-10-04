var express = require('express'),
	router  = express.Router(),
	Weather = require('../models/Weather'),
	Memcached = require('memcached');
	memcached = new Memcached("localhost:11211", {retries:10,retry:10000,remove:true});
	global  = require('../global');

	memcached.connect( 'localhost:11211', function( err, conn ){
		if( err ) throw new Error( err );
			console.log( conn );

			router.get('/', function(req, res, next){
				memcached.get('weather', function (err, data) {
					if(err){
						console.log(err);
					}

					if(data !== undefined) {
						console.log("DATA LOADED FROM CACHE");
						res.header('Content-Type', 'application/json');
						res.header('Cache-Control', 'public, max-age=100000');
						res.send(JSON.stringify(data));
					} else {
						console.log("DATA LOADED FROM API");
						Weather.getWeather(function(weather){
							memcached.set('weather', weather, 100, function (err) {
								res.header('Content-Type', 'application/json');
								res.send(JSON.stringify(weather));
				 			});
						});
					}
				});
			});
		});

module.exports = router;

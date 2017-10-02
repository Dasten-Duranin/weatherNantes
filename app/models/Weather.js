var global = require('../global');

//Attributes
function Weather(obj, callback) {
	this.id       = null;
	this.hostname = 'http://api.openweathermap.org';
	this.path     = '/data/2.5/forecast';
	this.api_key  = global.API_KEY;

	this.init(obj);
};
//Non-statics methods
Weather.prototype = {
	init: function(obj, callback)
	{
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) {
				this[fld] = obj[fld];
			}
		}
		
		if (this.id) {
			this.getInfos(callback);
		}
	},
	getInfos: function(callback)
	{
		var object = this;

		var req = http.request({
			hostname: object.url,
			port: 80,
			path: object.path,
			method: 'GET',
		}, function(res) {
			console.log(`STATUS: ${res.statusCode}`);
			console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`);
			});
			res.on('end', () => {
				console.log('No more data in response.');
			});
		});

		req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
		});
	},
};
//Statics methods
Weather.getWeather = function(callback)
{
	var weather = new Weather(global.ID_CITY, callback);
};

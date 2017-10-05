var global = require('../global'),
        http = require('http');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'weathernantes'});
const uuidv1 = require('uuid/v1');

//Attributes
function Weather(obj, callback) {
    this.id = null;
    this.host = 'api.openweathermap.org';
    this.path = '/data/2.5/forecast';
    this.api_key = global.API_KEY;

    this.iconPath = 'http://openweathermap.org/img/w/';
    this.iconExt = '.png';

    this.temp = null;
    this.tempMin = null;
    this.tempMax = null;
    this.condition = null;
    this.icon = null;

    this.init(obj, callback);
}
;
//Non-statics methods
Weather.prototype = {
    init: function (obj, callback)
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
    getInfos: function (callback)
    {
        var object = this,
                response = '';

        var req = http.request({
            host: object.host,
            port: 80,
            path: object.path + '?id=' + object.id + '&APPID=' + object.api_key + '&units=metric',
            method: 'GET',
        }, function (res) {
            //console.log(`STATUS: ${res.statusCode}`);
            //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                response = response + chunk;
            });
            res.on('end', () => {
                datas = JSON.parse(response)['list'][0];
                var now = new Date();

                object.temp = datas.main.temp;
                object.tempMin = datas.main.temp_min;
                object.tempMax = datas.main.temp_max;
                object.condition = datas.weather[0]['description'];
                object.icon = object.iconPath + datas.weather[0]['icon'] + object.iconExt;

                const query = 'INSERT INTO ' +
                        'weather2 (weather_id, condition, date, icon, temp, temp_max, temp_min) ' +
                        'VALUES( ?, ?, ?, ?, ?, ?, ?)';

                client.execute(query, [uuidv1(), object.condition, now, object.icon, object.temp, object.tempMax, object.tempMin], {prepare: true}, function (err, result) {
                    console.log(err);
                });

                //console.log(datas);
                callback(object);
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        req.end();
    },
};
//Statics methods
Weather.getWeather = function (callback)
{
    var weather = new Weather({'id': global.ID_CITY}, callback);
};

module.exports = Weather;

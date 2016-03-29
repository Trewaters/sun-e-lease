var express = require('express');
var app = express();
var nodeModules = express.Router();

var config = require('./config_bartapi.js');

var bodyParser = require('body-parser');

var logger = require('morgan');
app.use(logger('dev')); // dev format (:method :url :status :response-time ms - :res[content-length])

var parseString = require('xml2js').parseString;

/*
//app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.set('views', path.join(__dirname,'views'));
app.set('view engine','jade');

var index = require('./routes/index');

app.use('/',index);
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(__dirname + 'public'));
app.use(express.static('public'));

/*
http test
*/
var vCmd = 'etd';
var vOrig = 'RICH';
var vShow = '';

var http = require('http');

var options = {
    host: 'api.bart.gov',
    path: '/api/' + vCmd + '.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client
};

callback = function(response) {

    var str = '';
    var vParsed = '';

    response.on('data', function(chunk) {
        str += chunk;
        vParsed += chunk;
    });

    response.on('end', function() {

        parseString(vParsed, function(err, result) {
            vShow = JSON.stringify(result);
            console.log(vShow)
        });
    });
};

//https://nodejs.org/api/http.html#http_http_request_options_callback
http.request(options, callback).end();

app.get('/', function(req, res) {
    console.log('get /');

    /*
    bart.advisories('station');
    
    bart.realTimeEstimates({
        'cmd':'etd','orig':'RICH'
    });
    */

    res.send('BART api website is running. BART API data = ' + vShow);

});

app.post('/post_this', function(req, res) {
    res.send('BART api "post_this"');
});

app.delete('/delete_this', function(req, res) {
    res.send('BART api "delete_this"');
});

app.put('/put_this', function(req, res) {
    res.send('BART api "put_this"');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("app.listen on port 3000, http://%s%s", host, port);
});
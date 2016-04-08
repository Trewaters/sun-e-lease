// yah.js

var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var util = require('util');

var config = require('../config_bartapi');

var http = require('http');

var vCmd = '';
var vOrig = '';
var vShow = '';

var str = '';
var vParsed = '';

router.route('/here')
    .get(function(req, res) {
        vCmd = 'stns';

        var options = {
            host: 'api.bart.gov',
            path: '/api/stn.aspx?cmd=' + vCmd + '&key=' + config.bart.client
        };

        callback = function(response) {
            
            response.on('data', function(chunk) {
                vParsed += chunk;
                //console.log('vParsed = ' + vParsed);
            });
            
            response.on('end', function() {
                parseString(vParsed, function(err, result) {
                    vShow = JSON.stringify(result);
                    
                    //console.log('stations = ' + vShow);
                    console.log("result.root.uri = " + JSON.stringify(result.root.uri) + "\n");
                    console.log("result.root.stations = " + util.inspect(result.root.stations,{showHidden:false, depth:null}) + "\n");
                    console.log("result.root.stations.station.name = " + JSON.stringify(result.root.stations[0].station[0].name) + "\n");
                    
                    return res.jsonp(result.root.stations);
                });
            });
            
        };

        http.request(options, callback).end();
        
    });

module.exports = router;
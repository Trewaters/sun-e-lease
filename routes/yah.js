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

/*
router.route('/here')
    .get(function(req, res) {
        
        var vAbbr = req.params.abbr;
        
        var latlon = position.coords.latitude + "," + position.coords.longitude;
        var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";
            
            "<br><img src='" + img_url + "'>"
           
        });
     */
router.route('/listAllStations')
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
                    console.log("result.root.stations = " + util.inspect(result.root.stations, { showHidden: false, depth: null }) + "\n");
                    console.log("result.root.stations.station.name = " + JSON.stringify(result.root.stations[0].station[0].name) + "\n");

                    console.log("stations array length = " + result.root.stations.length);
                    var vIndexNum = result.root.stations.length - 1;
                    console.log("list station number = " + result.root.stations[vIndexNum].station.length);
                    var vStaNum = result.root.stations[vIndexNum].station.length;

                    // fun random numbers for data selection
                    function randomIntFromInterval(min, max) {
                        return Math.floor(Math.random() * (max - min + 1) + min);
                    };

                    var vRando = randomIntFromInterval(1, vStaNum);

                    //console.log(result.root.stations[vIndexNum].station[vRando].name + " station coords = \nLatitude (" + result.root.stations[vIndexNum].station[vRando].gtfs_latitude + "), \nLongitude (" + result.root.stations[vIndexNum].station[vRando].gtfs_longitude + ")\n");

                    return res.send(result.root.stations[0].station);
                });
            });

        };

        http.request(options, callback).end();


    });

module.exports = router;
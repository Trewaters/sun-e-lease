// yah.js

var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var util = require('util');

var config = require('../config_bartapi');

var http = require('http');

/*
var vCmd = '';
var vOrig = '';
var vShow = '';

var str = '';
var vParsed = '';
*/
var vTemp; // [DEBUG]
var vSave; // [DEBUG]

/*
router.route('/here')
    .get(function(req, res) {
        
        var vAbbr = req.params.abbr;
        
        var latlon = position.coords.latitude + "," + position.coords.longitude;
        var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";
            
            "<br><img src='" + img_url + "'>"
           
        });
     */

// Real Time Departure from a given station
router.route('/departTimeStation')
    .get(function(req, res) {
        var vParsed = ''; // [DEBUG]
                
        vCmd = 'etd';
        vOrig = req.query.vOriginStation;
        vDir = 'n'; // [NOTE] - 'n' or 's', north or south, OPTIONAL
        vPlat = 1; // [NOTE] - 1 to 4, number of platform, OPTIONAL
        
        //console.log('vOriginStation' + req.query)

        var xoptions = {
            host: 'api.bart.gov',
            path: '/api/etd.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client

            // all the optional fields for the path
            //path: '/api/etd.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client + '&dir=' + vDir + '&plat=' + vPlat   
        };

        var xcallback = function(response) {

            response.on('data', function(chunk) {
                vParsed += chunk;
            });

            response.on('end', function() {
                parseString(vParsed, function(err, result) {
                    vShow = JSON.stringify(result);

                    console.log("etd result.root.uri, BART API url = " + JSON.stringify(result.root.uri) + "\n");
                    console.log("etd result.root.date, Date the call was made = " + JSON.stringify(result.root.date) + "\n");
                    console.log("etd result.root.time, Time the call was made = " + JSON.stringify(result.root.time) + "\n");
                    //console.log("etd result.root.station = " + util.inspect(result.root.station, { showHidden: false, depth: null }) + "\n");
                    
                    console.log("etd station array length, Station of Origin = " + result.root.station.length);
                    var vIndexStation = result.root.station.length - 1;
                    
                    // [NOTE] This will let me know how many trains are leaving the station at any given time
                    console.log("etd etd array length, How many trains departing station = " + result.root.station[vIndexStation].etd.length);
                    var vIndexEtd = result.root.station[vIndexStation].etd.length - 1;
                    
                    console.log("destination =" + result.root.station[vIndexStation].etd[vIndexEtd].destination);
                    console.log("abbreviation =" + result.root.station[vIndexStation].etd[vIndexEtd].abbreviation);

                    console.log("etd estimate array length, Time for next #" + result.root.station[vIndexStation].etd[vIndexEtd].estimate.length + ' lines');                    
                    var vIndexEstimate = result.root.station[vIndexStation].etd[vIndexEtd].estimate.length - 1;
                    
                    console.log("minutes until departure = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].minutes);
                    console.log("platform trian departs = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].platform);
                    console.log("direction of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].direction);
                    console.log(" length of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].length);
                    console.log("color of the trian = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].color);
                    console.log("hexcolor of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].hexcolor);
                    console.log("bikeflag = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].bikeflag);
                    
                    //console.log("etd list station number = " + result.root.station[vIndexNum].station.length);
                    //var vStaNum = result.root.stations[vIndexNum].station.length;

                    vSave = JSON.stringify(result.root.station);
                    
                    //return JSON.stringify(result.root.station);
                    return res.send (vSave);
                });
            });
        };
        
        http.request(xoptions, xcallback).end();
        //var vTestHttp = http.request(xoptions, xcallback).end(); // [DEBUG]
        
        //return res.send (vSave);

    });

// list all BART stations
router.route('/listAllStations')
    .get(function(req, res) {
        var vParsed = ''; // [DEBUG]
        
        vCmd = 'stns';

        var options = {
            host: 'api.bart.gov',
            path: '/api/stn.aspx?cmd=' + vCmd + '&key=' + config.bart.client
            //path: '/api/etd.aspx?cmd=etd&orig=RICH&key=' + config.bart.client // [DEBUG]
                 
        };

        var callback = function(response) {

            response.on('data', function(chunk) {
                vParsed += chunk;
            });

            response.on('end', function() {
                parseString(vParsed, function(err, result) {
                    vShow = JSON.stringify(result);
                    
                    //if(result.root.stations == null || result.root.stations == ''){return res.send(['no trains to display'])}

                    
                    console.log('stations = ' + vShow);
/*
                    console.log("stns result.root.uri = " + JSON.stringify(result.root.uri) + "\n");
                    console.log("stns result.root.stations = " + util.inspect(result.root.stations, { showHidden: false, depth: null }) + "\n");
                    console.log("stns result.root.stations.station.name = " + JSON.stringify(result.root.stations[0].station[0].name) + "\n");
*/
                    
                    //console.log("stns result.root.stations = " + util.inspect(result.root.stations, { showHidden: false, depth: null }) + "\n");
/*
                    console.log("stns stations array length = " + result.root.stations.length);
                    var vIndexNum = result.root.stations.length - 1;
                    console.log("stns list station number = " + result.root.stations[vIndexNum].station.length);
                    var vStaNum = result.root.stations[vIndexNum].station.length;

                    // fun random numbers for data selection
                    function randomIntFromInterval(min, max) {
                        return Math.floor(Math.random() * (max - min + 1) + min);
                    };

                    var vRando = randomIntFromInterval(1, vStaNum);
*/
                    //console.log(result.root.stations[vIndexNum].station[vRando].name + " station coords = \nLatitude (" + result.root.stations[vIndexNum].station[vRando].gtfs_latitude + "), \nLongitude (" + result.root.stations[vIndexNum].station[vRando].gtfs_longitude + ")\n");

                    vTemp = result.root.stations[0].station;
                    return res.send (vTemp)
                    //vTemp = vShow; // [DEBUG]
                    //return res.send(vTemp);
                    //return res.send(result.root.stations[0].station);
                });
            });
        };

        //var vTestHttp2 = http.request(options, callback).end(); // [DEBUG]
        http.request(options, callback).end();
    });

router.route('/callHttp')
.get(function(req,res){
    // load variables
    
    // use switch statement to call the approprate http request
    
    //http.request(options, callback).end();
    
});

module.exports = router;
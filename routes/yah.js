// yah.js

var express = require('express');
var router = express.Router();
var app = express();
var parseString = require('xml2js').parseString;
var util = require('util');
var moment = require('moment');
var geo = require('geolib'); // not being used at the moment 4/20/2016. added for geoLocation methods. ( https://www.npmjs.com/package/geolib )


var config = require('../config_bartapi');

var http = require('http');
/*
var vCmd = '';
var vOrig = '';
var vShow = '';

var str = '';
var vParsed = '';
*/
/*
router.route('/here')
    .get(function(req, res) {
        
        var vAbbr = req.params.abbr;
        
        var latlon = position.coords.latitude + "," + position.coords.longitude;
        var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";
            
            "<br><img src='" + img_url + "'>"
           
        });
     */

// Trip details for a specified departure time
router.route('/tripDetailsDepart')
    .get(function(req,res){
        
        // vOriginStation, vDestStation, 
                
        var vParsed = '';
        
        vCmd = 'depart';
        vOrig = req.query.vOriginStation;
        vDest = req.query.vDestStation;
        vTime = req.query.vTime; // OPTIONAL - "h:mm+am/pm" or "now" departure time,
        vDate = req.query.vDate; // OPTIONAL - "mm/dd/yyy" or "now" or "today" date for trip, 
        vB = req.query.vB; // OPTIONAL - "0 to 4" how many trips before the specified time should be returned?, 
        // [NOTE] - I set this to 0 so I avoid any times before the user arrives at the station
        vA = req.query.vA; // OPTIONAL - specify how many trips after the specified time should be returned,
        // [NOTE] - I set this to 1 so I can get the next train for the user. 
        vLegend = req.query.vLegend; // OPTIONAL - show legend information "0" is no and "1" is yes;
        
        var depart_options = {
            host: 'api.bart.gov',
            path: '/api/sched.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&dest=' + vDest + '&date=today&time=now&b=0&a=1&key=' + config.bart.client + '&l=1'
            // example - http://api.bart.gov/api/sched.aspx?cmd=depart&orig=ASHB&dest=CIVC&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1
        };
        
        var depart_callback = function (response){
            
            response.on('data', function(chunk){
                vParsed += chunk;
            });
            
            response.on('end', function(){
                parseString(vParsed, {explicitArray:false}, function(err, result){
                    
                    if(err){console.log('err = ' + err)}; // [DEBUG]
                    
                    console.log('depart = ' + util.inspect(result, {showHidden: false, depth: 10})); // [DEBUG]
                    
                    return res.send(result.root);
                });
            });
        };
    http.request(depart_options, depart_callback).end();
});

// Nearest Station to current location
router.route('/nearestStation')
    .get(function (req, res) {
        var vParsed = '';
        var vStSchAll = '';

        var vCurPosLat;
        var vCurPosLong;

        var vDesLat;
        var vDesLong;

        //console.log("req.params = " + util.inspect(req.params, { showHidden: false, depth: null }) + "\n"); // [DEBUG]

        // extract long/lat from "vLoc" & "vStSchAll"
        vCurPosLat = req.query.latitude;
        vCurPosLong = req.query.longitude;

        //console.log("nearestStation, latitude = " + req.query.latitude + ", longitude = " + req.query.longitude + "\n"); // [DEBUG]

        var nearStns_options = {
            host: 'api.bart.gov',
            path: '/api/stn.aspx?cmd=stns&key=' + config.bart.client
        };

        var nearStns_callback = function (response) {

            response.on('data', function (chunk) {
                vParsed += chunk;
            });

            response.on('end', function () {
                parseString(vParsed, {explicitArray:false}, function (err, result) {
                    
                    vStSchAll = result;

                    if (err) { console.log('err = ' + err) }; // [DEBUG]

                    var vShortestDist = 9999;
                    var vShortestSta = '';
                    var vShortestAbbr = '';
                    var vShortestLong;
                    var vShortestLat;
                    var vShortestAddr;
                    var vShortestCity;
                    var vShortestZip;

                    for (var i = 0; i < vStSchAll.root.stations[0].station.length; i++) {
                        

                        vDist = geo.getDistance(
                            { latitude: vCurPosLat, longitude: vCurPosLong },
                            { latitude: vStSchAll.root.stations[0].station[i].gtfs_latitude[0], longitude: vStSchAll.root.stations[0].station[i].gtfs_longitude[0] }
                        );
                       
                        // [NOTE] - I am not dealing with the rare case where two or more stations are equally distant from you
                        if (vShortestDist > vDist) {
                            
                            vShortestDist = vDist;
                            vShortestSta = vStSchAll.root.stations[0].station[i].name[0];
                            vShortestAbbr = vStSchAll.root.stations[0].station[i].abbr[0];
                            vShortestLat = vStSchAll.root.stations[0].station[i].gtfs_latitude[0];
                            vShortestLong = vStSchAll.root.stations[0].station[i].gtfs_longitude[0];
                            vShortestAddr = vStSchAll.root.stations[0].station[i].address[0];
                            vShortestCity = vStSchAll.root.stations[0].station[i].city[0];
                            vShortestZip = vStSchAll.root.stations[0].station[i].zipcode[0];
                            vShortestCounty = vStSchAll.root.stations[0].station[i].county[0];
                            
                        };
                        if (vStSchAll.root.stations[0].station.length - 1 == i) {
                            return res.json({ 'nearSta': vShortestSta, 'nearDist': vShortestDist, 'nearAbbr': vShortestAbbr , 'nearLat': vShortestLat, 'nearLong': vShortestLong, 'nearAddr': vShortestAddr, 'nearCity': vShortestCity, 'nearZip' : vShortestZip, 'nearCounty': vShortestCounty});
                        };
                    };
                });
            });
        };

        http.request(nearStns_options, nearStns_callback).end();

    });

// Get Station Schedule information
router.route('/stationSched')
    .get(function (req, res) {
        var vParsed = '';

        vCmd = 'stnsched';
        vOrig = req.query.vOriginStation;
        vDate = 'today'; // OPTIONAL - specifies a date to be used, can use 'today' or 'now' also
        //vI = ''; // [NOTE] unknown value here. I see it in the examples but there isn't any explanation of what it is. 

        var stnsched_options = {
            host: 'api.bart.gov',
            path: '/api/sched.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client
        };

        var stnsched_callback = function (response) {

            response.on('data', function (chunk) {
                vParsed += chunk;
            });

            response.on('end', function (err, result) {
                parseString(vParsed, {explicitArray:false}, function (err, result) {
                    //console.log("stnsched result = " + util.inspect(result, { showHidden: false, depth: 6 }) + "\n");

                    console.log("stnsched result.root.uri = " + result.root.uri + "\n"); // [NOTE] url
                    console.log("stnsched result.root.date = " + result.root.date + "\n"); // [NOTE] date as 'mm/dd/yyyy'
                    console.log("stnsched result.root.sched_num = " + result.root.sched_num + "\n"); // [NOTE] number

                    // get result.root.station.length to use as index
                    console.log("stnsched result.root.station[0].name = " + result.root.station[0].name + "\n"); // [NOTE] long station name
                    console.log("stnsched result.root.station[0].abbr = " + result.root.station[0].abbr + "\n"); // [NOTE] station abbreviation 'NBRK'

                    console.log("stnsched result.root.station[0].item[0].$.line = " + result.root.station[0].item[0].$.line + "\n"); // [NOTE] route as 'ROUTE #'
                    console.log("stnsched result.root.station[0].item[0].$.trainHeadStation = " + result.root.station[0].item[0].$.trainHeadStation + "\n"); // [NOTE] station abbreviation 'FRMT'
                    console.log("stnsched result.root.station[0].item[0].$.origTime = " + result.root.station[0].item[0].$.origTime + "\n"); // [NOTE] 'h:mm AM'
                    console.log("stnsched result.root.station[0].item[0].$.destTime = " + result.root.station[0].item[0].$.destTime + "\n"); // [NOTE] 'h:mm AM'
                    console.log("stnsched result.root.station[0].item[0].$.trainIdx = " + result.root.station[0].item[0].$.trainIdx + "\n"); // [NOTE] number
                    console.log("stnsched result.root.station[0].item[0].$.bikeflag = " + result.root.station[0].item[0].$.bikeflag + "\n"); // [NOTE] number

                    console.log("stnsched result.root.message[0] = " + result.root.message[0] + "\n"); // [NOTE] text

                    // get upper and lower bounds for the station schedule
                    var vUpTime;
                    var vLowTime;
                    var vTotalTrains;
                    var vIndexTime;

                    vTotalTrains = result.root.station[0].item.length;
                    vIndexTime = vTotalTrains - 1;

                    vLowTime = result.root.station[0].item[0].$.origTime;
                    vUpTime = result.root.station[0].item[vIndexTime].$.origTime;

                    // convert to station object
                    var objStnSched;

                    objStnSched = JSON.parse(JSON.stringify(result.root));

                    // compare vLowTime with current time (vNow). Fail gracefully if trains have not started
                    var vNow = moment();
                    var vTooEarly;

                    if (moment(vNow).isBefore(vLowTime)) { vTooEarly = true } else { vTooEarly = false };

                    // add fields to object
                    objStnSched.UpTime = vUpTime;
                    objStnSched.LowTime = vLowTime;
                    objStnSched.vTooEarly = vTooEarly;

                    // convert to JSON with new fields added
                    vStnSched = JSON.stringify(objStnSched);

                    if (vTooEarly) {
                        return res.send(['Train do not start until ' + vLowTime]);
                    };

                    //return res.send(result.root);
                    return res.send(vStnSched);
                });
            });
        };
        http.request(stnsched_options, stnsched_callback).end();
    });

// Real Time Departure from a given station
router.route('/departTimeStation')
    .get(function (req, res) {
        var vParsed = '';

        vCmd = 'etd';
        vOrig = req.query.vOriginStation;
        vDir = 'n'; // [NOTE] - 'n' or 's', north or south, OPTIONAL
        vPlat = 1; // [NOTE] - 1 to 4, number of platform, OPTIONAL

        var etd_options = {
            host: 'api.bart.gov',
            path: '/api/etd.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client

            // all the optional fields for the path
            //path: '/api/etd.aspx?cmd=' + vCmd + '&orig=' + vOrig + '&key=' + config.bart.client + '&dir=' + vDir + '&plat=' + vPlat   
        };

        var etd_callback = function (response) {

            response.on('data', function (chunk) {
                vParsed += chunk;
            });

            response.on('end', function () {
                parseString(vParsed, {explicitArray:false}, function (err, result) {

                    // console.log("etd result = " + util.inspect(result, { showHidden: false, depth: null }) + "\n"); // [DEBUG]
                    
                   // console.log("result.root.message[0].warning[0] = " + result.root.message[0].warning[0] + "\n"); // [DEBUG]
                    
                    // [TO DO] - refine this message/error checking so I can get the specific station message. Currently checking a non-existant value causes an error that breaks the app. 
                    /*
                    
                    if (result.root.message[0].warning[0] !== '' || result.root.message[0].warning[0] !== null ){
                        if(result.root.station[0].message[0].error[0] !== null){
                            return res.send([result.root.station[0].message[0].error[0]]);
                        }else{
                            return res.send([result.root.message[0].warning[0]]);
                        };
                    };
                    */
                    
                    if (result.root.message[0] !== ''){
                         return res.send([result.root.message[0].warning[0]]);
                    };
                    

                    if (result.root.uri == null || result.root.uri == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("etd result.root.uri, BART API url = " + JSON.stringify(result.root.uri) + "\n");
                    };

                    if (result.root.date == null || result.root.date == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("etd result.root.date, Date the call was made = " + JSON.stringify(result.root.date) + "\n");
                    };

                    if (result.root.time == null || result.root.time == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("etd result.root.time, Time the call was made = " + JSON.stringify(result.root.time) + "\n");
                    };


                    if (result.root.station[0].etd[0].destination == null || result.root.station[0].etd[0].destination == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("etd result.root.station = " + util.inspect(result.root.station, { showHidden: false, depth: null }) + "\n");
                        console.log("etd station array length, Station of Origin = " + result.root.station[0].name[0]);
                        var vIndexStation = result.root.station.length - 1;

                        // [NOTE] This will let me know how many trains are leaving the station at any given time
                        console.log("etd etd array length, How many trains departing station = " + result.root.station[vIndexStation].etd.length);
                        var vIndexEtd = result.root.station[vIndexStation].etd.length - 1;

                        console.log("destination station = " + result.root.station[vIndexStation].etd[vIndexEtd].destination);
                    };

                    if (result.root.station[0].etd[0].abbreviation == null || result.root.station[0].etd[0].abbreviation == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("abbreviation = " + result.root.station[vIndexStation].etd[vIndexEtd].abbreviation);
                    };


                    if (result.root.station[0].etd[0].estimate[0].minutes == null || result.root.station[0].etd[0].estimate[0].minutes == '') {
                        return res.send(['no trains to display']);
                    } else {

                        console.log("etd estimate array length, Time for next #" + result.root.station[vIndexStation].etd[vIndexEtd].estimate.length + ' lines');
                        var vIndexEstimate = result.root.station[vIndexStation].etd[vIndexEtd].estimate.length - 1;

                        console.log("minutes until departure = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].minutes);

                        console.log("platform trian departs = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].platform);

                        console.log("direction of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].direction);

                        console.log(" length of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].length);

                        console.log("color of the trian = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].color);

                        console.log("hexcolor of the train = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].hexcolor);

                        console.log("bikeflag = " + result.root.station[vIndexStation].etd[vIndexEtd].estimate[vIndexEstimate].bikeflag);
                    };
                    return res.send(result.root.station);
                });
            });
        };
        http.request(etd_options, etd_callback).end();
    });

// list all BART stations
router.route('/listAllStations')
    .get(function (req, res) {
        var vParsed = '';

        vCmd = 'stns';

        var stns_options = {
            host: 'api.bart.gov',
            path: '/api/stn.aspx?cmd=' + vCmd + '&key=' + config.bart.client
            //path: '/api/etd.aspx?cmd=etd&orig=RICH&key=' + config.bart.client // [DEBUG]

        };

        var stns_callback = function (response) {

            response.on('data', function (chunk) {
                vParsed += chunk;
            });

            response.on('end', function () {
                parseString(vParsed, {explicitArray:false}, function (err, result) {
                    vShow = JSON.stringify(result);

                    //if(result.root.stations == null || result.root.stations == ''){return res.send(['no trains to display'])}


                    //console.log('stations = ' + vShow);
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

                    return res.send(result.root.stations[0].station)
                });
            });
        };

        //var vTestHttp2 = http.request(options, callback).end(); // [DEBUG]
        http.request(stns_options, stns_callback).end();
    });

router.route('/callHttp')
    .get(function (req, res) {
        // load variables

        // use switch statement to call the approprate http request

        //http.request(options, callback).end();

    });

module.exports = router;
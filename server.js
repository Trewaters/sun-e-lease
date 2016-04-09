var express = require('express');
var app = express();

var config = require('./config_bartapi.js');

var bodyParser = require('body-parser');

var logger = require('morgan');
app.use(logger('dev')); // dev format (:method :url :status :response-time ms - :res[content-length])

var parseString = require('xml2js').parseString;
var util = require('util');
var path = require('path');

/*
app.use(favicon(__dirname + '/public/img/favicon.ico'));
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('view engine','jade');


// initialize routes
var yah = require('./routes/yah');
app.use('/yah',yah);


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
    var vParsed ='';

    response.on('data', function(chunk) {
        str += chunk;
        vParsed += chunk;
    });

    response.on('end', function() {

        parseString(vParsed, function(err, result) {
            vShow = JSON.stringify(result);
            
            //console.log("vShow = " + vShow + "\n");
            
            //console.log("result.root = " + JSON.stringify(result.root) + "\n");
            
            console.log("result.root.uri = " + JSON.stringify(result.root.uri) + "\n");
            console.log("result.root.date = " + JSON.stringify(result.root.date) + "\n");
            console.log("result.root.time = " + JSON.stringify(result.root.time) + "\n");
            console.log("result.root.station = " + util.inspect(result.root.station,{showHidden:false, depth:null}) + "\n");
            
            console.log("result.root.station[0].name = " + result.root.station[0].name + "\n");
            console.log("result.root.station[0].abbr = " + result.root.station[0].abbr + "\n");
            console.log("result.root.station[0].etd[0].destination = " + result.root.station[0].etd[0].destination + "\n");
            console.log("result.root.station[0].etd[0].abbreviation = " + result.root.station[0].etd[0].abbreviation + "\n");
            console.log("result.root.station[0].etd[0].limited = " + result.root.station[0].etd[0].limited + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].minutes = " + result.root.station[0].etd[0].estimate[0].minutes + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].platform = " + result.root.station[0].etd[0].estimate[0].platform + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].direction = " + result.root.station[0].etd[0].estimate[0].direction + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].length = " + result.root.station[0].etd[0].estimate[0].length + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].color = " + result.root.station[0].etd[0].estimate[0].color + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].hexcolor = " + result.root.station[0].etd[0].estimate[0].hexcolor + "\n");
            console.log("result.root.station[0].etd[0].estimate[0].bikeflag = " + result.root.station[0].etd[0].estimate[0].bikeflag + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].minutes = " + result.root.station[0].etd[0].estimate[1].minutes + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].platform = " + result.root.station[0].etd[0].estimate[1].platform + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].direction = " + result.root.station[0].etd[0].estimate[1].direction + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].length = " + result.root.station[0].etd[0].estimate[1].length + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].color = " + result.root.station[0].etd[0].estimate[1].color + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].hexcolor = " + result.root.station[0].etd[0].estimate[1].hexcolor + "\n");
            console.log("result.root.station[0].etd[0].estimate[1].bikeflag = " + result.root.station[0].etd[0].estimate[1].bikeflag + "\n");
            /*
            console.log("result.root.station[0].etd[1].destination = " + result.root.station[0].etd[1].destination + "\n");
            console.log("result.root.station[0].etd[1].abbreviation = " + result.root.station[0].etd[1].abbreviation + "\n");
            console.log("result.root.station[0].etd[1].limited = " + result.root.station[0].etd[1].limited + "\n");
            
            console.log("result.root.station[0].etd[1].estimate[0].minutes = " + result.root.station[0].etd[1].estimate[0].minutes + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].platform = " + result.root.station[0].etd[1].estimate[0].platform + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].direction = " + result.root.station[0].etd[1].estimate[0].direction + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].length = " + result.root.station[0].etd[1].estimate[0].length + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].color = " + result.root.station[0].etd[1].estimate[0].color + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].hexcolor = " + result.root.station[0].etd[1].estimate[0].hexcolor + "\n");
            console.log("result.root.station[0].etd[1].estimate[0].bikeflag = " + result.root.station[0].etd[1].estimate[0].bikeflag + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].minutes = " + result.root.station[0].etd[1].estimate[1].minutes + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].platform = " + result.root.station[0].etd[1].estimate[1].platform + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].direction = " + result.root.station[0].etd[1].estimate[1].direction + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].length = " + result.root.station[0].etd[1].estimate[1].length + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].color = " + result.root.station[0].etd[1].estimate[1].color + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].hexcolor = " + result.root.station[0].etd[1].estimate[1].hexcolor + "\n");
            console.log("result.root.station[0].etd[1].estimate[1].bikeflag = " + result.root.station[0].etd[1].estimate[1].bikeflag + "\n");
            */
            console.log("result.root.message = " + JSON.stringify(result.root.message) + "\n");
            
            
            return result;
           /*
            for (x in result){
              str += result[x];
              console.log("result["+ x + "] = " + str + "\n");  
            };
            
            //console.log(util.inspect(vShow,{showHidden:false, depth:null}));
            
           vObjShow = JSON.parse(vShow); 
            
            console.log("uri = " + vObjShow.root.uri);
            console.log("date = " + vObjShow.root.date);
            console.log("time = " + vObjShow.root.time);
            console.log("message = " + vObjShow.message);
                        
            vStationObj = JSON.parse(JSON.stringify(vObjShow.root.station) + " \n");
            console.log("vStationObj = " + JSON.stringify(vStationObj));
            
            vStationSplit = JSON.stringify(vObjShow.root.station).split(",");
            console.log("vStationSplit = " + JSON.stringify(vStationSplit) + " \n");
            
            var vStationArray = Object.keys(vStationObj);
            console.log("vStationArray = " + vStationArray + " \n");
            
            for (x = 0; x < vStationSplit.length; x++){
              var txt = vStationSplit[x];
              //if "[" or if "=" or if "\"" or if "{" or if "}"
              // then replace with ""
              // 
             
              console.log( "vStationSplit["+ x +"]" + txt);   
            };
            */
            
            /*
            http://www.w3schools.com/jsref/jsref_obj_string.asp (string methods)
            
                        var txt;
            for (x in vStationSplit){
              txt += vStationSplit[x];
              console.log( "vStationSplit["+ x +"]" + txt);   
            };
            
            */
            
        });
    });
};

//https://nodejs.org/api/http.html#http_http_request_options_callback

//http.request(options, callback).end();

var server = app.listen(3000, function() {
    var address = server.address().address;
    var port = server.address().port;

    console.log("app.listen on port 3000, http://%s%s", address, port);
});
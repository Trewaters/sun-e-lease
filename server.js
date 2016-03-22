var express = require('express');
var app = express();
//[reference] https://www.npmjs.com/package/morgan
var logger = require('morgan');
//[reference] https://www.npmjs.com/package/body-parser
var bodyParser = require('body-parser');

// [TO DO] - remove until I have a config file to point to
//var config = require('./config_bartapi.js');

var index = require('./routes/index');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','jade');

app.use('/',index);

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(morgan('dev')); // dev format (:method :url :status :response-time ms - :res[content-length])

app.use(express.static(__dirname + 'public'));

app.get('/',function(req, res){
    res.send('BART api website is running.');
});

app.listen(3333, function(){
    console.log("app.listen on port 3333");
});
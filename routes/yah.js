// yah.js

var express = require('express');
var router = express.Router();

var config = require('../config_bartapi');

router.route('/here')
.get(function(req,res){
   
   
   return ('testing /here') 
});

module.exports = router;
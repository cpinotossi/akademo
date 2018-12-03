var express = require('express');
var router = express.Router();
var request = require('request');
var parser = require('xml2json');

var userName = "Christian";
var policyImageManager = "thumbnails";

/* GET home page. */
router.get('/', function(req, res, next) {
  // Retrieve current list of Images via NetStorage HTTP API
  request('http://api.hebe.io/img/cpt', function(error, response, body) {
    console.log('Netstorage File List statusCode:', response && response.statusCode);
    //Define array in which we will store all the file names which we recieve from NetStorage HTTP API
    var imageArray = null;
    //Execute only if we receive an 200 from NetStorage HTTP API
    if (response.statusCode == 200) {
      // Transform NetStorage File list from xml to json object
      var fileArray = (parser.toJson(body, {
        object: true
      })).stat.file;
      // Iterate through the json object file entries and generate corresponding html code.
      imageArray = [];
      for (var file in fileArray) {
        if ((fileArray[file].name).endsWith(".jpg")) {
          imageArray.push(fileArray[file].name);
        }
      }
    }
    //render result
    res.render('index', {
      title: userName,
      pim: policyImageManager,
      imageArray: imageArray
    });
  });
})


module.exports = router;

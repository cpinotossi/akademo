var express = require('express');
var router = express.Router();
var request = require('request');
var parser = require('xml2json');

/* GET home page. */
router.get('/', function(req, res, next){
    // Retrieve current list of Images
    request('http://api.hebe.io/img/cpt', function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred and handle it
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          var imageArray = null;
          if(response.statusCode == 200){
            // Transform into an json object
            fileList = (parser.toJson(body, {object: true})).stat.file;
            //console.log('body:'+body);
            console.log('fileList:'+ JSON.stringify(fileList, null, 2));
            // Iterate through the json object file entries and generate corresponding html code.
            imageArray = [];
            for (var file in fileList) {
              if((fileList[file].name).endsWith(".jpg")){
                console.log("file.name: "+fileList[file].name);
                imageArray.push(fileList[file].name);
              }
            }
          }
          //render result
          res.render('index', { title: 'Christian', imageArray: imageArray });
    });

})


module.exports = router;

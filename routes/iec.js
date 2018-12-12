var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const profile = req.user.profile;
  var date = new Date();
  var timestamp = date.getTime();
  const email = profile.emails[0].value;
  const clientID = (email.split('@'))[0] + timestamp;
  res.render('iec', {
    title: "MQTT Websocket Client",
    jwt: generateJWT(profile, clientID),
    displayName: profile.displayName,
    clientID: clientID,
    host: 'na.iec.hebe.io',
    topic: 'demo/test'
  });
})

module.exports = router;


//Create the IEC JWT

//Import Modules
const jwtSimple = require('jwt-simple');
require('dotenv').config();


function generateJWT(profile, clientID) {
  //Define jwt alg to be used:
  var jwtHeader = {
    "algorithm": "RS256"
  };
  //retrieve JWT Key by jwtname from .env
  var jwtPrivateKey = process.env['edgegate_iec_jwt'].replace(/\\n/g, '\n');

  //generate JWT Payload
  var jwtPayload = {
    "iss": 'hebe.io',
    "displayName": profile.displayName,
    "provider": profile.provider,
    "clientID": clientID,
    "authGroups": "pub;sub"
  };
  var jwt = jwtSimple.encode(jwtPayload, jwtPrivateKey, jwtHeader.algorithm);
  console.log("\n");
  console.log(`jwt = ${jwt}`);
  return jwt;
}

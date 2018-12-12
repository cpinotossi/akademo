var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  //User already logged in with an google account
  if (req.user) {
    if (req.user.profile) {
      let profile = req.user.profile;
      let email = profile.emails[0].value;
      //user logged in with an akamai google account:
      if (validateAkamaiEmail(email)) {
        res.render('login', {
          title: "Client Login",
          displayName: profile.displayName,
          clientID: email,
          url: "/iec",
          urlText: "Open Client",
          message: "Hello " + profile.displayName + ", you are logged in with an Akamai Google Account: " + email + ". Please start the Client with the following link:"
        });
      } else {
        //user not logged in with an akamai google account:
        res.render('login', {
          title: "Client Login",
          displayName: profile.displayName,
          clientID: email,
          url: "/auth/google",
          urlText: "Login with Google",
          message: "NOTE: You tried to login with " + email + ". Access is only allowed with Emails which end on @akamai.com. Please logout first from your current Google Account and login again here:"
        });

      }

    }
  }
  //User not logged in with an google account
  else {
    res.render('login', {
      title: "Client Login",
      displayName: "",
      clientID: "",
      url: "/auth/google",
      urlText: "Login with Google",
      message: "Please login with an Akamai Google Account which end on @akamai.com:"
    });
  }

})

function validateAkamaiEmail(email) {
  var re = /\S+@akamai\.com/;
  return re.test(String(email).toLowerCase());
}


module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.setHeader('Cache-Control', 'no-store');
  res.render('logout', {
    title: "Client Logout",
    displayName: "",
    clientID: "",
    url: "/login",
    message: "Successfully logout, click the link below to login again"
  });
})



module.exports = router;

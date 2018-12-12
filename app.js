//start in debug: DEBUG=akademo:* npm start
//start in chrome debug:
//step#1: node --inspect ./bin/www
//step#2: open chrome://inspect
//start with instance change:
//nodemon bin/www

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const auth = require('./auth');
const passport = require('passport');

//Define Routes
const indexRouter = require('./routes/index');
const iecRouter = require('./routes/iec');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const app = express();



//Session Managment
app.use(cookieSession({
  keys: ['123'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());

//Auth settings
auth(passport);
app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.disable('view cache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/iec', ensureIECAuthenticated, iecRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);


app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));


app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'login'
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect('/iec');
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//   Simple route middleware to ensure user is authenticated.
function ensureIECAuthenticated(req, res, next) {
  // passport session established
  if (req.session.token) {
    //Logged in with an akamai google account?
    if (req.user) {
      if (validateAkamaiEmail(req.user.profile.emails[0].value)) {
        return next();
      }
      //Not logged in with an akamai google account
      else {
        res.redirect('/login');
      }
    }
    //Not logged in with an akamai google account
    else {
      res.redirect('/login');
    }
  }
  //need to login
  else {
    res.redirect('/login');
  }
}

function validateAkamaiEmail(email) {
  var re = /\S+@akamai\.com/;
  return re.test(String(email).toLowerCase());
}

module.exports = app;

require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = (passport) => {
  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // Used to decode the received cookie and persist session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy({
      clientID: '605516950786-jskddglrkuqk618bl69b7nu9nkqj5h8d.apps.googleusercontent.com',
      clientSecret: process.env['googleClientSecret'],
      callbackURL: 'http://www.edgegate.de/auth/google/callback'
    },
    (token, refreshToken, profile, done) => {
      // passes the profile and token data to serializeUser
      return done(null, {
        profile: profile,
        token: token
      });
    }));
};

function extractProfile(profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}

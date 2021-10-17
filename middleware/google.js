require('dotenv').config();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('../models/index.model');
const user = db.user;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret:process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

        const id = profile.id;
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const profilePhoto = profile.photos[0].value;
        const source = "google";
       user.findOrCreate({ Userid: profile.id }, { FullName: profile.displayName,UserId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

module.exports = passport;
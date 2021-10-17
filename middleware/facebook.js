require("dotenv").config();
require("../config/db.postgres.config");
const passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../models/index.model');
const user = db.user;

passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback",
    profileFields   : ['id','displayName','name','gender','picture.type(large)','email']
  },
  function(accessToken, refreshToken, profile, done) {
  

    user.findOrCreate({Email: profile.email}, {FullName: profile.displayName,UserId: profile.id,UserName:profile.email}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  return done(null,user)
});

module.exports = passport;


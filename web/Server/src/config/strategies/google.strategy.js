var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require("../config")
var usersRepo = require("../../dal/index").usersRepo;
module.exports = function() {
  passport.use(new GoogleStrategy({
      clientID: '534322822844-5pjhroof05k86rmrjr22mush0ai3062j.apps.googleusercontent.com',
      clientSecret: 'KxtSaAlKL_nVZJVOceGmc9v5',
      callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      var collection = db.collection('users');
      collection.findOne({
          username: profile.emails[0].value
      }, function(err, results) {
        if (results === null) {
          var chats = {};
          var user = {
              username: profile.emails[0].value,
              password: null,
              verified: true
          };
          usersRepo.registerUser(user, {
            success: function(){
                done(null, user);
            },
            error: function(){
              done(null, false, {
                message: 'Unknown Error'
              });
            }
          });
        } else {
            var user = results;
            done(null, user);
        }
    });
  }));
};

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var config = require("../config")
var FacebookStrategy = require('passport-facebook').Strategy;
var usersRepo = require("../../dal/index").usersRepo;
module.exports = function() {
  passport.use(new FacebookStrategy({
    clientID: '973949779417962',
    clientSecret: '93d8eaf83023e14d118eb68a30325471',
    callbackURL: "/auth/facebook/callback",
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(req, accessToken, refreshToken, profile, done) {
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

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var config = require("../config")
var usersRepo = require("../../dal/index").usersRepo;

var FacebookStrategy = require('passport-facebook').Strategy;
module.exports = function() {
  passport.use(new FacebookStrategy({
    clientID: '1783959788508578',
    clientSecret: '83aa5008ecdf68379ffc2d84717688c1',
    callbackURL: "/auth/facebook-mobile/callback",
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(req, accessToken, refreshToken, profile, done) {
    var collection = db.collection('users');
    console.log("finding user in fb mobile");
    collection.findOne({
        username: profile.emails[0].value
    }, function(err, results) {
      console.log("Here is what was found");
      console.log(results);

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

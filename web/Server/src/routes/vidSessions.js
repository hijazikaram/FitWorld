var express = require('express');
var router = express.Router();
var vidChatRepo = require("../dal/repos").vidChatRepo;
var usersRepo = require("../dal/repos").usersRepo;
var config = require("../config/config")
var apiKey = config.openTokSessionApiKey;
var apiSecret = config.openTokApiSecret;

var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, apiSecret);

var VidSession = function(data){
  return {
    _id: data._id,
    openTokSessionId: data.openTokSessionId
  };

}

var getVidChatId = function (organizerId, sessionId) {
  return organizerId + "_" + sessionId;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/join', function(req, res, next){
  var sessionId = req.body.sessionId;
  var providerUsername = "monzerhijazi@gmail.com";
  var currentUserName = "monzerhijazi+1@gmail.com";
  console.log("about to get user");
  vidChatRepo.getSession(sessionId, {
    success: function(vidSession){
      console.log("video session found");
      var tokenOptions = {};
      tokenOptions.role = "publisher";
      tokenOptions.data = "username=bob";
      var token = opentok.generateToken(vidSession.openTokSessionId, tokenOptions);
      console.log("found generated ne token: " + token);
      res.json(Object.assign(VidSession(vidSession), {token}))
    },
    error: function(err){
      console.log(sessionId);
      console.error("Error occured fetching session");
    }
  });
});

router.post('/start', function(req, res, next){
    var sessionId = req.body.sessionId;
    console.log(sessionId);
    var user = req.user;
    console.log(sessionId);

    console.log("testing again");
    if(user.providerDetails){
      console.log("about to start session");
      var organizerId = user._id;
      var sessionId = sessionId;

      vidChatRepo.getSession(sessionId, {
        success: function(session){
          //if session has already started return what openTok can use to enter session
          var tokenOptions = {};
          tokenOptions.role = "moderator";
          tokenOptions.data = "username=bob";
          console.log(session);

          var token = opentok.generateToken(session.openTokSessionId, tokenOptions);
          console.log("found generated ne token: " + token);

          res.json(Object.assign(VidSession(session), {token}))
        },
        error: function(){
          //since no session exists we can start an openTok Session and save it to the db
          // The session will the OpenTok Media Router, which is required for archiving:
          console.log("not found");
          opentok.createSession({mediaMode:"routed"}, function(err, openTokSession) {
            console.log("opentok creation session completed");
            console.log("good job");
            if (err) {
              console.log("error occured");
              console.log(err);
              //send response with error
              return;
            }

            var dto = VidSession({
              _id: sessionId,
              openTokSessionId: openTokSession.sessionId
            });

            var tokenOptions = {};
            tokenOptions.role = "moderator";
            tokenOptions.data = "username=bob";
            console.log(openTokSession.sessionId);
            console.log("----");
            // Generate a token.
            token = opentok.generateToken(openTokSession.sessionId, tokenOptions);

            vidChatRepo.addSession(dto, {
              success: function(){

                res.json(Object.assign({}, dto, { token }));
              }
            });


            console.log(token);



            //send to organizer who will use web/mobile client to start meeting
          });
        }
      })

    }
    console.log(user);
});

module.exports = router;

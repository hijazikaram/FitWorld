var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
//var favicon = require('serve-favicon');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var port = process.env.PORT || 5000;
var repos = require('./src/dal/repos');

var chatRepo = repos.chatRepo;
var usersRepo = repos.usersRepo;

var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var Grid = require('gridfs-stream');
var multer = require("multer");
// var routes = require('../Server/src/routes/index.js');
var users = require('../Server/src/routes/users.js');
var providers = require('../Server/src/routes/provider.js');
var authRouter = require('../Server/src/routes/authRoutes')();
var vidSessionsRouter = require("../Server/src/routes/vidSessions");
var config = require('./src/config/config.js');


var app = require('express')();
var http = require('http');
var https = require("https");

var MongoClient = require("mongodb").MongoClient;
var mongoUrl = config.dbUrl;
//mongoUrl = 'mongodb://exequt:yyytFBMDP22mHpFb@cluster0-shard-00-00-vryrp.mongodb.net:27017,cluster0-shard-00-01-vryrp.mongodb.net:27017,cluster0-shard-00-02-vryrp.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
//var database = new mongodb.Db('fitWorld', new mongodb.Server("127.0.0.1", 27017));


var mongoDbPromise = MongoClient.connect(mongoUrl)

var fs = require("fs");

var options = {
   key  : fs.readFileSync(config.keyPath),
   cert : fs.readFileSync(config.certPath)
};

app.locals.version = function () {
  return config.version;
};

//authentication setup
require('../Server/src/config/passport')(app);

// view engine setup
app.set('views', './Client/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout extractScripts", true);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));
app.use(cookieParser());
app.use(express.static('public'));

var sess = { store: new MongoStore({ dbPromise: mongoDbPromise }), secret: 'fitworld+exequt=awesomesss',  cookie: {maxAge: 6000000000}};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(function(req,res,next){
  if(req.user) {
    console.log("logged in");
    next();
    return;
  }
  console.log("session not logged in");

  if(req.path === '/' || req.path.toLowerCase().indexOf('/auth/') !== -1){
    console.log("accepted url");
    next();
    return;
  }

  res.redirect("/?m=Please login&info=" + req.url);

});

app.use('/users', users);
app.use('/Auth', authRouter);
app.use('/providers', providers);
app.use("/vidSessions", vidSessionsRouter)

app.use(function(req, res, next){
   // if there's a flash message in the session request, make it available in the response, then delete it
   res.locals.sessionFlash = req.session.sessionFlash;
   delete req.session.sessionFlash;
   next();
});


// Route that creates a flash message using the express-flash module
app.all('/express-flash', function( req, res ) {
   req.flash('success', 'This is a flash message using the express-flash module.');
   res.redirect(301, '/');
});

// Route that creates a flash message using custom middleware
app.all('/session-flash', function( req, res ) {
   req.session.sessionFlash = {
       type: 'success',
       message: 'This is a flash message using custom middleware and express-session.'
   };
   res.redirect(301, '/');
});



// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
  var m = req.query.m;
  if(req.user && req.user.providerDetails){
    res.redirect('/providers/Home');
    return;
  }
  console.log(req.user);
  if(req.user && !m){
    m = 'You must be a provider to login to this tool.'
  }

  res.render('signIn', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash, message: m, redirectPath: req.query.info });

});



app.get('/error', function( req, res ) {
   res.render('error', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

app.get('/chat', function(req, res){
  if (req && req.query) {
      res.render('chat', {user: req.user._id, user1: req.query.id});
  }
});

app.post('/chat', function(req, res){
  console.log("starting chat");
  chatRepo.addMessage(req.body.msg,req.body.chatId,req.body.createdAt);
  console.log("ending chat");
  res.json({status: "success"});
});

app.post('/chat/load', function(req, res){

  var collection = db.collection('chats');
  try {
      collection.findOne({"id": req.body.chatId}, function(err, result) {
          if (err) {
            console.log(err);
          }
          if (result) {
            var messages = [];
            var i = result.msgs.length - 1;
            var j = 0;
            console.log(new Date(req.body.startDate));
            while (i >= 0 && j < 10 && j < result.msgs.length) {
              console.log(i);
              if (new Date(result.msgs[i].createdAt) < new Date(req.body.startDate)) {
                console.log(result.msgs[i]);
                messages.push(result.msgs[i]);
                j++
              }
              i--;
            }
            console.log(messages);
            res.json({status: "success", messages: messages});
          } else {
            res.json({status: "failure", message: "Failed to load earlier messgaes"});
          }
      });
  } catch (e) {
      console.log(e);
      res.json({status: "failure", message: "Failed to load earlier messages."});
  }

});



mongoDbPromise.then(function(db){
  global.db = db;

  db.createCollection("transactions");

  var gfs = Grid(db, mongodb);
  global.gfs = gfs;

  usersRepo.addAdminIfDoenstExist();

  // http.listen(config.port, function(){
  //   console.log('listening on *:3000');
  // });

  var server = https.createServer(options, app).listen(config.port, function () {
   console.log('Started https!');
  });

  var io = require('socket.io')(server);

  io.on('connection', function(socket){
    socket.on('join', function (data) {
      console.log("joining " + data.email);
      socket.join(data.email);
    });
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg,chatRoomId,user,user1, ack){
      console.log('message: ' + msg);
      chatRepo.addMessage(msg,chatRoomId,Date.now(), {
        success: function(messageObject){
          console.log("success added chat");
          console.log(user);
          console.log(user1);
          io.to(user).emit('chat message', msg, messageObject, chatRoomId);
          io.to(user1).emit('chat message', msg, messageObject, chatRoomId);
          if(ack){
            ack("done", messageObject, chatRoomId);
          }
        },
        error: function(err){
          console.log("success removed chat");
          ack("error", err)
        }
      });

    });
  });

  // Redirect from http port 80 to https
  http.createServer(function(req, res){
    if(!req.headers['host']){
      res.writeHead(301, { "Location": rU });
      res.end();
      return;
    }

    var rU = "https://" + req.headers['host'].replace(config.unsecurePort, config.port) + req.url;
    res.writeHead(301, { "Location": rU });
    res.end();
  }).listen(config.unsecurePort);

}).catch(function(err){
  console.log("DB Connection failed");
  console.log(err);
});

module.exports = app;

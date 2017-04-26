var express = require('express');
var config = require('../config/config.js');

var nodemailer = require('nodemailer');

var multer = require('multer');
var router = express.Router();
var repos = require('../dal/repos');
var uuid = require('node-uuid');
var providersRepo = repos.providersRepo;
var usersRepo = repos.usersRepo;
var authUtil = require("../utils/auth");

//global variables used: gfs, db
var fs = require('fs');

var uploadImage = multer({
    dest: './images/',
    inMemory: true,
    rename: function(fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
});
var profileImage = multer({
    dest: './profileImage/',
    inMemory: true,
    rename: function(fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
});
var EMAIL_ACCOUNT_USER = config.emailAccountUser;
var EMAIL_ACCOUNT_PASSWORD = config.emailPassword;
var YOUR_NAME = config.emailName;

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail", // sets automatically host, port and connection security settings
    auth: {
        user: EMAIL_ACCOUNT_USER,
        pass: EMAIL_ACCOUNT_PASSWORD
    }
});


var sendEmailToAcceptedProvider = function(req, res, email) {
    var appUrl = req.protocol + '://' + req.get('Host') + "/auth/signUp?info=";
    var username = req.body.userName;
    console.log(email);
    var string = encodeURIComponent(email);
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'malik.hijazi@gmail.com',
            pass: 'Drogb@!3'
        }
    });
    var mailOptions = {
        from: '"FIT WORLD 👥" <malik.hijazi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Accepted", // Subject line
        text: "Hello, per our review your application to become a provider has been accepted. Please register using the following link: " + appUrl + string
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
    req.flash('success');
};
var sendEmailToDeniedProvider = function(req, res, email) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'malik.hijazi@gmail.com',
            pass: 'Drogb@!3'
        }
    });
    var mailOptions = {
        from: '"FIT WORLD 👥" <malik.hijazi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Sorry you have been denied", // Subject line
        text: "Hello, unfortnatelly, your request has been denied. Please reach out to customer support if you have any questions." // plaintext body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
    req.flash('success');
};
//ask rob if he can become a provider
router.get('/provider', function(req, res, next) {
    res.render('becomeProvider');
});
router.get('/GetOpenProviderApplicants', function(req, res, next) {
  console.log("in endpoint getOpen");

  var collection = db.collection('providerApplications');
  collection.find({}).toArray(function(err, results) {
      if (err) {
          console.log(err);
      }
      if (results === null) {
          console.log("No providers avilable.");
      } else {
          console.log(results);
          openApplicants = [];
          declinedApplicants = [];
          acceptedApplicants = [];
          for (var i = 0; i < results.length; i++) {
              if (results[i].status === "open") {
                  openApplicants.push(results[i]);
              } else if (results[i].status === "declined") {
                  declinedApplicants.push(results[i]);
              } else if (results[i].status === "accepted") {
                  acceptedApplicants.push(results[i]);
              }
          }
          res.json({
              openApplicants: openApplicants,
              declinedApplicants: declinedApplicants,
              acceptedApplicants: acceptedApplicants
          });
      }
  });

});

router.get("/ProvidersResume/:id", function(req, res) {
    var readstream = gfs.createReadStream({
        _id: req.params.id
    });
    readstream.on("error", function(err) {
        res.send("No file found with that title");
    });
    readstream.pipe(res);
});

var saveGig = function(gig, req, res) {

  var isGigNew = !gig.id;
  console.log("saveGig called");
  if(isGigNew){
    console.log("creating new ID");
    gig.id = uuid.v4();
  } else {
    var gigs = req.user.gigs || [];
    var gigInMemory = gigs.filter(function(g) { return g.id === gig.id })[0];
    console.log("this was a gig");
    console.log(gigInMemory);
    gig = Object.assign({}, gigInMemory, gig);
  }
  usersRepo.uploadGig(gig, req.user, {
      success: function(gig) {
        console.log("gig saved to DB");
        var userGigs = req.user.gigs || [];
        if(isGigNew){
          console.log("adding gig to user in req");
          userGigs.push(gig);
        } else {
          console.log("replacing gig");
          var gigIndex = gigs.findIndex(function(g) { return g.id === gig.id });
          console.log(gigIndex);
          userGigs[gigIndex] = gig;
        }
        req.user.gigs = userGigs;
        res.json(gig);
      },
      failure: function(e) {
          if (req.body.mobile) {
              res.json({
                  status: "failure"
              });
          } else {
              req.flash('success', 'Error, please try again.');
              res.redirect('/providers/provider');
          }
      }
   });
}

router.post('/AddOrUpdateGig', uploadImage.single("gigImage"), function(req, res, next) {
  console.log("endpoint called");
  console.log(req.body);
  console.log(req.file);
  var body = req.body;
  var parsePackages = JSON.parse(body.packages)
  //console.log(parsePackages);
  var gig = {
      id: body.id,
      packages: parsePackages,
      primaryCategory: body.primaryCategory,
      secondaryCategory: body.secondaryCategory,
      description: body.description,
      instruction: body.instruction,
      name: body.name
  };

  if(req.file){
    var writestream = gfs.createWriteStream({
        filename: req.file.originalname
    });
    console.log(req.user);
    writestream.on('close', function(savedImage) {
        gig.gigImageId = savedImage._id;
        gig.gigImageName = savedImage.filename;
        saveGig(gig, req, res);
    });

    fs.createReadStream("./images/" + req.file.filename)
      .on("end", function() {
          fs.unlink("./images/" + req.file.filename, function(err) {

          });
      })
      .on("err", function() {
          res.send("Error uploading image");
      })
      .pipe(writestream);

  } else {
     saveGig(gig, req, res);
  }



});
router.get("/Images/:id", function(req, res) {
    var readstream = gfs.createReadStream({
        _id: req.params.id
    });
    readstream.on("error", function(err) {
        res.send("No image found with that title");
    });
    readstream.pipe(res);
});

var saveProviderDetails = function(providerDetails, req, res){
  usersRepo.providerDetails(providerDetails, req.user, {
    success: function(providerDetails) {
      console.log("providerDetails saved");
      console.log(providerDetails);
      res.json(providerDetails);
    },
    error: function(e) {
      console.log("providerDetails failiure");
      res.json({
          status: "failure",
          error: e
      });
    }
  });
}

var sendEmailInvitation = function(req, res, email) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'malik.hijazi@gmail.com',
            pass: 'Drogb@!3'
        }
    });
    var mailOptions = {
        from: '"FIT WORLD 👥" <malik.hijazi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "You've been invited to FitWorld!", // Subject line
        text: "Hello, the provider " + req.user.providerDetails.name + " has invited you to FitWorld.\n\n To accept their invitation download the app and register!" // plaintext body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};

router.post('/inviteUser', function(req, res, next){
  if(!req.user.providerDetails){
    res.status(401).send({ error: "Not authorized"});
    return;
  }

  console.log("in invite user");
  console.log("checking email");

  if(!req.body.email){
    res.status(500).send({ error: "Email is required to send invitation"});
    return;
  }

  console.log("getting user");

  usersRepo.getUserByUsername(req.body.email, {
    success: function(user){
      console.log("sending invitation");
      usersRepo.addInvitationTransaction(user._id, req.user._id, {
        success: function(){
          sendEmailInvitation(req, res, req.body.email);
          var userDto = Object.assign({}, user, { password: null, upcomingSessions: null, clients: null, verificationToken: null });
          res.json({ user: userDto });
        },
        error: function(){
          res.status(500).send({ error: "An unexplained error has occured."});
        }
      })
    },
    error: function(){
      //add pending invitation
      console.log("adding pending invitation");
      usersRepo.addPendingInvitation(req.body.email, req.user._id, {
        success: function(){
          sendEmailInvitation(req, res, req.body.email);
          res.json({});
        },
        error: function() {
          res.status(500).send({ error: "An unexplained error has occured."});
        }
      });
    }
  })

});

router.post('/ProviderDetails', uploadImage.single("profileImage"), function(req, res, next) {
  console.log("endpoint called");
  console.log(req.body);
  console.log(req.file);
  var body = req.body;
  var parseAvailability = JSON.parse(body.availability)
  var parseSkills = JSON.parse(body.skills)
  var parseLanguages = JSON.parse(body.languages)
  var parseEducation = JSON.parse(body.education)
  var providerDetails = {
    availability: parseAvailability,
    skills: parseSkills,
    languages: parseLanguages,
    education: parseEducation,
    description: body.description,
    linkedinLink: body.linkedinLink,
    facebookLink: body.facebookLink,
    twitterLink: body.twitterLink,
    contactNumber: body.contactNumber,
    contactEmail: body.contactEmail,
    portfolioLink: body.portfolioLink,
    websiteLink: body.websiteLink,
    biography: body.biography,
    freeConsulation: body.freeConsulation,
    name: body.name
  };

  if(req.file){
    var writestream = gfs.createWriteStream({
        filename: req.file.originalname
    });
    console.log(req.user);
    writestream.on('close', function(savedImage) {
      console.log("provider image saved");
      console.log(savedImage._id);
      providerDetails.profileImageId = savedImage._id;
      providerDetails.profileImageName = savedImage.filename;
      console.log("file from DB:");
      console.log(savedImage);
      saveProviderDetails(providerDetails, req, res);
     });

    fs.createReadStream("./images/" + req.file.filename)
        .on("end", function() {
            fs.unlink("./images/" + req.file.filename, function(err) {

            });
        })
        .on("err", function() {
            res.send("Error uploading image");
        })
        .pipe(writestream);
    } else {
      saveProviderDetails(providerDetails, req, res);
    }
});
router.get("/CreateProfileImage/:id", function(req, res) {
    var readstream = gfs.createReadStream({
        _id: req.params.id
    });
    readstream.on("error", function(err) {
        res.send("No image found with that title");
    });
    readstream.pipe(res);
});



router.get('/adminPage', function(req, res, next) {
  if(!req.user || !req.user.isAdmin){
    res.send(401, 'You are not an admin');
    return;
  }

  res.render('admin');

});
router.get('/Home*', function(req, res, next) {
  if(req.user.providerDetails)
    res.render('index', {v: config.version});
  else {
    req.logOut();
    res.redirect('/auth/login?m=You are not a provider please login to our mobile app');
  }
});
// router.get('/Dashboard2', function(req, res, next) {
//     res.render('dashboard');
// });
router.get('/adminPage/:status', function(req, res, next) {
  if(!req.user || !req.user.isAdmin){
    res.send(401, 'You are not an admin');
    return;
  }
    console.log("in this endoint");
    console.log(req.params.status);
    res.render('admin', {
        status: "open"
    });
});
router.post('/adminPage/delete', function(req, res, next) {

  if(!req.user || !req.user.isAdmin){
    res.send(401, 'You are not an admin');
    return;
  }

    var providerId = req.body._id;
    var email = req.body.email;
    console.log(req.body);
    console.log(providerId);
    console.log(req.body.email);
    providersRepo.changeProviderStatusToDecline(providerId, {
        success: function() {
            if (req.body.mobile) {
                res.json({
                    status: "success"
                });
            } else {
                res.send({
                    redirect: '/adminPage/delete'
                });
            }
        },
        failure: function(e) {
            if (req.body.mobile) {
                res.json({
                    status: "failure"
                });
            } else {
                req.flash('success', 'Error, please try again.');
                res.redirect('/adminPage');
            }
        }
    });
    sendEmailToDeniedProvider(req,res, email);
});
router.post('/adminPage/accept', function(req, res, next) {

  if(!req.user || !req.user.isAdmin){
    res.send(401, 'You are not an admin');
    return;
  }

  var providerId = req.body._id;
  var email = req.body.email;
  console.log(providerId);
  providersRepo.changeProviderStatusToAccept(providerId, {
      success: function() {
          if (req.body.mobile) {
              res.json({
                  status: "success"
              });
          } else {
              res.send({
                  redirect: '/adminPage/accept'
              });
          }
      },
      failure: function(e) {
          if (req.body.mobile) {
              res.json({
                  status: "failure"
              });
          } else {
              req.flash('success', 'Error, please try again.');
              res.redirect('/adminPage');
          }
      }
  });

  var obj = {};

  var collection = db.collection('users');
  collection.updateOne({
    username: email
  },
  {
    $set: {
     'providerDetails': obj
  }});

  sendEmailToAcceptedProvider(req,res, email);
});

router.post('/getCurrentProvider', function(req, res, next) {
  if (!req.user || !req.user.providerDetails) {
    res.json({status: "failure"});
  } else {
    console.log("currentProvider");
    console.log(req.user);
    var upcomingSessions = null;
    var clients = null;

    var doneTasks = function(){
      if(upcomingSessions && clients){
        var user = Object.assign({}, req.user, { password: null, upcomingSessions: upcomingSessions, clients: clients });
        res.json({status: "success", user: user});
      }
    }

    providersRepo.upcomingSessions(req.user._id, { success: function(sessions){
      upcomingSessions = sessions;
      doneTasks();
    }, error: function(err){
      res.json({status: "failure", error: err });
    }});

    providersRepo.getClients(req.user._id, {
      success: function(clientResults){
        clients = clientResults;
        doneTasks();
      },
      error: function (err) {
        res.json({status: "failure", error: err });
      }
    })
  }
});

router.get("/startSession", function(req,res,next){
  res.render("startSession", { sessionId: req.query.sessionId });
});

module.exports = router;

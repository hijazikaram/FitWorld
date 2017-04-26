var express = require('express');
var multer = require('multer');
var router = express.Router();
var braintree = require("braintree");
var repos = require('../dal/repos');
var usersRepo = repos.usersRepo;

//global variables used: gfs, db
var fs = require('fs');

var uploadImage = multer({
    dest: './images/',
    inMemory: true,
    rename: function(fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    },
    limits: { fieldSize: 100 * 1024 * 1024 }
});

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "6jfzh9m8d7ccqkz8",
  publicKey: "x8y2f9bfn2gn3zmx",
  privateKey: "6e401b98a9c420342858c5d7c466da27"
});

/* GET users listing. */
router.post('/saveUserDetails', function(req, res, next) {
  usersRepo.saveUserDetails(req.user, req.body, {
    success: function (userDetails) {
      req.user.userDetails = Object.assign({}, req.user.userDetails, userDetails);

      res.json({status: "success", userDetails: req.user.userDetails});
    },
    error: function (e) {
      res.json({status: "failure"});
    }
  });
});

router.post('/saveUserName', function(req, res, next) {
  console.log("in saveUsername route");
  console.log("saving user");
  usersRepo.saveUserName(req.user, req.body.name, {
    success: function (user) {
      req.user.name = req.body.name;
      res.json({status: "success"});
    },
    error: function (e) {
      res.json({status: "failure"});
    }
  });
});

router.post('/profileImage', uploadImage.single("image"), function(req,res,next){
  console.log(req);
  console.log(req.file);
  if(req.file && req.user){
    var writestream = gfs.createWriteStream({
        filename: req.file.originalname
    });
    console.log(req.user);
    writestream.on('close', function(savedImage) {
        console.log("file from DB:");
        console.log(savedImage);
        usersRepo.saveProfileImageId(req.user.username, savedImage._id, {
          success: function(){
            var userDetails = req.user.userDetails || {};
            userDetails.profileImageId = savedImage._id;
            req.user.userDetails = userDetails;
            res.json({status: "success", user: req.user });
          },
          error: function(){
            res.json({status: "failure"});
          }
        });
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
  }
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//this is to get a blank token to get fresh brain tree UI
router.get('/blankCCToken', function(req, res, next) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send({clientToken: response.clientToken});
  });
})

router.get('/ccToken', function (req, res, next) {
  if (req.user.braintreeID == null) {
    usersRepo.createBraintreeID(req, gateway, {
      success: function (user) {
        req.user = user;
      },
      error: function (e) {
        console.log(e);
      }
    });
  }
  gateway.clientToken.generate({customerId: req.user.braintreeID}, function (err, response) {
    res.send(response.clientToken);
  });
});


router.get('/paymentMethods', function (req, res, next) {
  console.log("req.user");
  console.log(req.user);
  if (!req.user.braintreeID) {
    usersRepo.createBraintreeID(req, gateway, {
      success: function (user) {
        req.user = user;
      },
      error: function (e) {
        console.log(e);
        res.json({status: "failure"});
      }
    });
  } else {
    var customerID = req.user.braintreeID;
    gateway.customer.find(customerID, function(err, customer) {
      console.log(err);
      console.log(customer);
      var payment_methods = customer.creditCards.concat(customer.paypalAccounts);
      res.json({paymentMethods: payment_methods});
    });
  }
});

//add payment method to brain tree
router.post('/paymentMethod', function(req, res, next){
  console.log("in server add card");
  if (!req.user.braintreeID) {
    console.log("in req.user.brainID null");
    usersRepo.createBraintreeID(req, gateway, {
      success: function (user) {
        req.user = user;
        var customerID = req.user.braintreeID;
        console.log(customerID);
        var nonce = req.body.nonce; //tocken recieved from brain tree client sdk

        //add payment method to brain tree
        gateway.paymentMethod.create({
            customerId: customerID,
            paymentMethodNonce: nonce
          }, function (err, result) {
              if (err) {
                res.json({status: "failure"});
              } else {
                console.log(result);
                res.json({status: "success", creditCard: result});
              }
          });
      },
      error: function (e) {
        console.log(e);
        res.json({status: "failure"});
      }
    });
  } else {
    console.log("in req.user.brainID != null");
    var customerID = req.user.braintreeID;
    console.log(customerID);
    var nonce = req.body.nonce; //tocken recieved from brain tree client sdk

    //add payment method to brain tree
    gateway.paymentMethod.create({
        customerId: customerID,
        paymentMethodNonce: nonce
      }, function (err, result) {
          if (err) {
            console.log(err);
            res.json({status: "failure"});
          } else {
            console.log(result);
            res.json({status: "success", creditCard: result});
          }
    });
  }
  console.log("finished in server add card");
});

//update payment method to brain tree
router.put('/paymentMethod', function(req, res, next){
  var token = req.body.token;
  var expirationMonth = req.body.expirationMonth;
  var expirationYear = req.body.expirationYear;
  var cvv = req.body.cvv;

  //update payment method to brain tree
  gateway.paymentMethod.update(token, {
    expirationMonth: expirationMonth,
    expirationYear: expirationYear,
    cvv: cvv
  }, function (err, result) {
    if (err) {
      res.json({status: "failure"});
    } else {
      res.json({status: "success", creditCard: result});
    }
  });
});

router.post('/deletePaymentMethod', function(req, res, next){
  var token = req.body.token;
  console.log(token);

  //delete payment method in braintree
  gateway.paymentMethod.delete(token, function (err) {
    if (err) {
      console.log(err);
      res.json({status: "failure"});
    } else {
      res.json({status: "success"});
    }
  });
});

router.post('/payment', function(req, res, next){
  console.log("purchasing bundle server side");
  var providerId = req.body.providerId;
  var bundle = req.body.bundle;
  var paymentMethodToken = req.body.paymentMethodToken;
  var amount = bundle.price + ".00";
  var resTransaction = {
    type: "purchase",
    numSessions: bundle.numSessions,
    providerId: providerId,
    userId: req.user._id,
    price: bundle.price,
    gigName: req.body.gigName,
    gigId: req.body.gigId,
    token: paymentMethodToken
  };
  gateway.transaction.sale({
    paymentMethodToken: paymentMethodToken,
    amount: amount,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
      if (result.success) {
        //save transaction in our DB
        usersRepo.saveTransaction(req, result.transaction, resTransaction, {
          success: function (transaction) {
            res.json({status: "success", transaction: transaction});
          },
          error: function (e) {
            console.log(e);
            res.json({status: "failure", transaction: null});
          }
        });
      } else {
        res.json({status: "failure", transaction: null});
      }

  });
});

router.post('/getProviders', function(req, res, next){
  console.log(req.body);
  usersRepo.getProviders(req.body.email, req.body.fName, req.body.lName, {
    success: function(providers, email, fName, lName) {
      console.log("in getProviders post success callback");
      console.log(providers);
      res.json(
        {
          status: "success",
          providers: providers,
          email: email,
          fName: fName,
          lName: lName
        }
      );
    },
    failure: function(e) {
      res.json({status: "failure", message: e});
    }
  });
});

router.post('/bookSession', function(req, res, next){
  usersRepo.bookSession(req.user, req.body.provider, req.body.selectedDate, req.body.selectedTime, req.body.gigId, {
    success: function(transaction) {
      res.json(
        {
          status: "success",
          transaction: transaction
        }
      );
    },
    failure: function(e) {
      res.json({status: "failure", message: e});
    }
  });
});

router.post('/gigSearch', function(req, res, next){
  usersRepo.gigSearch(req.body.primaryCategory, req.body.category, req.body.type, {
    success: function(providers, primaryCategory, category, type) {
      res.json(
        {
          status: "success",
          providers: providers,
          primaryCategory: primaryCategory,
          category: category,
          type: type
        }
      );
    },
    failure: function(e) {
      res.json({status: "failure", message: e});
    }
  });
});

router.post('/providerSessions', function(req, res, next){
  usersRepo.providerSessions(req.body.providerId, {
    success: function(sessions) {
      res.json(
        {
          status: "success",
          sessions: sessions
        }
      );
    },
    failure: function(e) {
      res.json({status: "failure", message: e});
    }
  });
});
router.post('/providerTransactions', function(req, res, next){
  var providerId = req.user._id
  usersRepo.providerTransactions( providerId, {
    success: function(transactions) {
      res.json(
        {
          status: "success",
          transactions: transactions
        }
      );
    },
    failure: function(e) {
      res.json({status: "failure", message: e});
    }
  });
});

router.post('/gig', function(req, res, next){
  console.log("gigs post");
  console.log(req.user);
  console.log(req.body);
  if(req.user.providerDetails){
    var gigs = user.gigs || [];
    var gigPackages = gig.packages || [{numSessions: 1, price: 40},{numSessions:3, price: 80}, {numSessions:12, price: 120}];

    var newGig = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      primaryCategory: req.body.primaryCategory,
      secondaryCategory: req.body.secondaryCategory,
      instructions: req.body.instructions,
      packages: gigPackages.map(function(p) { return { numSessions: p.numSessions, price: p.price }})
    };
    gigs.push(newGig);

    usersRepo.addProviderGig(newGig, {
      success: function(){
        res.json(newGig);
      },
      error: function(err){
        console.log(err);
        res.status(500).send({ error: 'Something failed!' });
      }
    });

    user.gigs = gigs;
  }
});

router.post('/getTransactions', function(req, res, next){
  usersRepo.getTransactions(req, {
    success: function(transactions){
      usersRepo.getGigBalances(req.user, {
        success: function(gigBalances){
          res.json({transactions, gigBalances});
        },
        error: function(err){
          console.log(err);
        }
      });
    },
    error: function(err){
      console.log(err);
    }
  });
});

router.post('/cancelSession', function(req, res, next){
  usersRepo.cancelSession(req,req.body.session, {
    success: function(transaction){
      res.json({transaction});
    },
    error: function(err){
      console.log(err);
    }
  });
});

router.post('/rateSession', function(req, res, next){
  usersRepo.rateSession(req,req.body.rating, req.body.text, req.body.session, {
    success: function(rating){
      res.json({rating});
    },
    error: function(err){
      console.log(err);
    }
  });
});


module.exports = router;

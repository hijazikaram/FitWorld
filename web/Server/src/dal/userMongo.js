var bcrypt = require('bcryptjs');
var braintree = require("braintree");
var repos = require('../dal/repos');
var usersRepo = repos.usersRepo;
var ObjectId = require('mongodb').ObjectId;
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "6jfzh9m8d7ccqkz8",
    publicKey: "x8y2f9bfn2gn3zmx",
    privateKey: "6e401b98a9c420342858c5d7c466da27"
});
var authUtil = require('../utils/auth');
var config = require('../config/config')
var _ = require("lodash");
var services = {
    registerUser(user, callbacks){
      var obj = {};
       var collection = db.collection('providerApplications');
       collection.findOne({
           email: user.username,
           status: "accepted"
       }, function (err, results) {
         console.log("Searching for matching provider applications for: " + user.username);
         console.log(results);
         var providerDetails = user.username === config.adminEmail || results !== null ? {} : null;
         console.log(providerDetails);
         user.providerDetails = providerDetails;
         var collection = db.collection('users');
         collection.findOne({
             username: user.username
         }, function(err, results) {
             if (results === null) {

               var collection = db.collection('users');

               collection.insert(user, function(err, results) {
                 callbacks.success(user);
                 var pendingInvitationsColl = db.collection("pendingInvitations");
                 console.log("finding invitations");
                 pendingInvitationsColl.find({ userName: user.username }).toArray(function(err, results){
                   if(err){ return; }
                   console.log("invitations found... creating transactions");
                   console.log(results);
                   var transactions = _.map(results, function(r) {
                     return { transaction: {
                         userId: user._id,
                         type: "invite",
                         date: r.date,
                         providerId: r.providerId
                       }
                     };
                   });
                   console.log("inserting now");
                   console.log(transactions);

                   db.collection("transactions").insert(transactions)

                 });
               });

             } else {
               callbacks.error('User is already in the database please use another email.')
             }
         });
       });
    },
    addAdminIfDoenstExist(){
      console.log("add admin if doesnt exist called");
      services.getUserByUsername(config.adminEmail, {
        success: function(user){
          console.log("user found not creating user");
        },
        error: function(err){
          //user not found
          console.log("user not found creating admin user");
          services.registerUser({
              username: config.adminEmail,
              password: authUtil.createHash(config.adminPassword),
              verified: true,
              isAdmin: true,
              providerDetails: {},
          },
          {
            success: function() {
              console.log("admin user created");
            },
            error: function(err) {
             console.log("admin user not created: " + err);
           }
         });
        }
      });
    },
    addPendingInvitation(userName, providerId, callbacks){
      var collection = db.collection('pendingInvitations');
      collection.insert({
        userName: userName,
        providerId: providerId,
        date: Date.now()
      }, function(err){
        if(err){
          callbacks.error(err);
          return;
        }
        callbacks.success();
      })
    },
    addInvitationTransaction(userId, providerId, callbacks){
      var collection = db.collection('transactions');
      var transaction = {
          userId: userId,
          type: "invite",
          date: Date.now(),
          providerId: providerId
      };
        collection.insert({
            transaction
        }, function(err){

          if(err){
            console.log("error inserting transaction for invitatino");
            callbacks.error(err)
            return;
          }
          console.log("transaction inserted for invitation");
          callbacks.success();
        });

    },
    saveProfileImageId(username, profileImageId, callbacks) {
      var collection = db.collection('users');
      console.log("adding to db now");
      console.log(username);
      console.log(profileImageId);
      try {
          collection.updateOne({
              'username': username
          }, {
              $set: {
                  'userDetails.profileImageId': profileImageId
              }
          });
          callbacks.success();
      } catch (e) {
        callbacks.error(e);
      }
    },
    saveUserName(user, name, callbacks){
      console.log("saveUserName db");
      console.log(user);
      console.log(name);
      var collection = db.collection('users');
      collection.updateOne({
          '_id': ObjectId(user._id)
      }, {
          $set: {
              'name': name
          }
      }, {}, function(e) {
        if(e){
          console.log("an error occured");
          console.log(e);
          callbacks.error(e);
        }
        callbacks.success();
      });
    },
    saveUserDetails(user, body, callbacks) {
      var userDetails = {
        gender: body.gender,
        weight: body.weight,
        heightFt: body.heightFt,
        heightIn: body.heightIn,
        smoke: body.smoke,
        age: body.age
      };
      var collection = db.collection('users');
      try {
          collection.updateOne({
              'username': user.username
          }, {
              $set: {
                'userDetails.gender': userDetails.gender,
                'userDetails.weight': userDetails.weight,
                'userDetails.heightFt': userDetails.heightFt,
                'userDetails.heightIn': userDetails.heightIn,
                'userDetails.smoke': userDetails.smoke,
                'userDetails.age': userDetails.age
              }
          });

          callbacks.success(userDetails);
      } catch (e) {
        callbacks.error();
      }
    },
    getUser(userId, callbacks) {
        db.collection('users').findOne({
            _id: userId
        }, function(err, user) {
            if (err) {
                callbacks.error(e);
            }
            callbacks.success(user);
        });
    },
    getUserByUsername(userName, callbacks) {
        db.collection('users').findOne({
            username: userName
        }, function(err, user) {
            if (err || !user) {
                callbacks.error("User not found");
                return;
            }
            callbacks.success(user);
        });
    },
    createBraintreeID(req, gateway, callbacks) {
        var user = req.user;
        gateway.customer.create({}, function(err, result) {
            console.log(result);
            if (err) {
                console.log(err);
                callbacks.failure(err);
            }
            if (result.success) {
                user.braintreeID = result.customer.id;
                user.transactions = []
                var collection = db.collection('users');
                try {
                    collection.updateOne({
                        'username': req.user.username
                    }, {
                        $set: {
                            'braintreeID': result.customer.id
                        }
                    });
                    callbacks.success(user);
                } catch (e) {
                    callbacks.error(e);
                }
            } else {
                console.log("in failure");
            }
        });
    },
    becomeProvider(req, providerDetails, callbacks) {
        var user = req.user;
        console.log("im here");
        console.log(user);
        user.providerDetails = providerDetails;
        var collection = db.collection('users');
        try {
            collection.updateOne({
                'username': req.user.username
            }, {
                $set: {
                    'providerDetails': providerDetails
                }
            });
            req.user = user;
            callbacks.success();
        } catch (e) {
            callbacks.error(e);
        }
    },
    saveTransaction(req, transaction1, transaction, callbacks) {
        transaction.date = transaction1.createdAt;
        transaction.id = transaction1.id;
        transaction.merchantAccountId = transaction1.merchantAccountId;
        transaction.status = transaction1.status;
        var collection = db.collection('transactions');
        try {
            collection.insert({
                transaction
            });
            callbacks.success(transaction);
        } catch (e) {
            callbacks.failure(e);
        }
    },
    uploadGig(gig, user, callbacks) {

      db.collection('users').findOne({
        _id: ObjectId(user._id)
      },
      function(err, userFromDb) {
          if (err || !userFromDb) {
              console.log("no user found: " + err);
              callbacks.failure(err);
          }
          var gigs = userFromDb.gigs || [];
          var gIndex = _.findIndex(gigs, function(g) { return g.id === gig.id; });
          if(gIndex > -1) { gigs[gIndex] = gig }
          else { gigs.push(gig); }

          console.log("here they are");
          console.log(gigs);

          db.collection('users').updateOne({
              '_id': ObjectId(userFromDb._id)
          }, {
              $set: {
                  'gigs': gigs
              }
          }, {}, function(err){
            console.log("update comopleted");
            if(err){
              console.log("update failed");
              console.log(err);
              callbacks.failure(err);
              return;
            }

            callbacks.success(gig);
          });
      });
    },
    providerDetails(providerDetails, user, callbacks) {
        console.log(user);
        providerDetails = Object.assign({}, user.providerDetails, providerDetails);
        user.providerDetails = providerDetails;
        var collection = db.collection('users');
        try {
            collection.updateOne({
                'username': user.username
            }, {
                $set: {
                    'providerDetails': providerDetails
                }
            });
            callbacks.success(providerDetails);
        } catch (e) {
          console.log(e);
          callbacks.error(e);
        }

    },
    getGigBalances(user, callbacks){
      console.log("getting gig balances");
      var userId = user._id + "";
      console.log(userId);
      var map = function(){
        var t = this.transaction;
        var gigId = t.session ? t.session.gigId : t.gigId;
        print("getGigBalances mapReduce 1");
        if(gigId){
          var numCredits = 0;
          if (t.type === "purchase") {
            numCredits = t.numSessions;
          } else if (t.type === "schedule") {
            numCredits = -1;
          } else if (t.type === "cancel" && t.refundable) {
            numCredits = 1;
          }
          print(numCredits);
          emit(gigId, numCredits);
        }

      };

      var reduce = function(key, values){
        print("getGigBalances mapReduce 2");
        print(values);
        return Array.sum(values);
      }
      var collection = db.collection('transactions');
      collection.mapReduce(map, reduce, {
        query: { "transaction.userId": userId },
        out : { inline: 1}
      }, function(err, retCollection){
        if(err){
          console.log("Error getting counts");
          console.log(err);
          callbacks.error("Error getting counts")
          return;
        }
        console.log("Found counts");
        var retHash = {};
        for(var i = 0; i < retCollection.length; i++){
          var r = retCollection[i];
          retHash[r._id] = r.value;
        };
        console.log(retHash);
        callbacks.success(retHash)
      });

    },
    getProviders(email, fName, lName, callbacks) {
        console.log("checking if searchStrings are defined");
        if (email || fName || lName) {
            console.log("searchString");
            var email1 = email;
            var fName1 = fName;
            var lName1 = lName;
            if (!email) {
                email1 = "";
            }
            if (!fName) {
                fName1 = "";
            }
            if (!lName) {
                lName1 = "";
            }
            var collection = db.collection('users');
            collection.find({
                "providerDetails": {
                    $ne: null
                },
                "username": {
                    $regex: ".*" + email1 + ".*"
                }
            }).toArray(function(err, results) {
                if (err) {
                    callbacks.error("Error in db.");
                }
                if (results === null) {
                    callbacks.error("No providers avilable.");
                } else {
                    callbacks.success(results, email, fName, lName);
                }
            });
        } else {
          var collection = db.collection('users');
          collection.find({
              "providerDetails": {
                  $ne: null
              }
          }).toArray(function(err, results) {
              if (err) {
                  callbacks.error("Error in db.");
              }
              if (results === null) {
                  callbacks.error("No providers avilable.");
              } else {
                  callbacks.success(results);
              }
          });
        }
    },
    bookSession(user, providerFromClient, selectedDateStr, selectedTime, gigId, callbacks) {
        var selectedDate = new Date(selectedDateStr);

        var providerID = providerFromClient._id;
        var gig = null;

        var providerCollection = db.collection('users');
        console.log("finding provider");
        providerCollection.findOne({
          _id: ObjectId(providerID)
        }, function(err, provider){

          if(err || !provider){
            console.log("error getting provider " + providerID);
            console.log(err);
            callbacks.error("Provider not found");
          }
          console.log("Found provider");
          var gigs = provider.gigs || [];
          console.log("findings gigs");

          gig = gigs.find(g => g.id === gigId);

          if(!gig){
            callbacks.error("Gig not found");
          }
          console.log("gig found");
          console.log(gig);
          var startTimeNumber = parseInt(selectedTime.substring(0, 2));
          var AMPM = selectedTime.substring(selectedTime.length - 2);

          if(AMPM === "AM"){
            selectedDate.setHours(startTimeNumber === 12 ? 0 : startTimeNumber);
          } else {
            selectedDate.setHours(startTimeNumber === 12 ? 12 : startTimeNumber + 12);
          }
          selectedDate.setMinutes(0);

          var endTimeNumber;
          if (startTimeNumber === 12) {
              endTimeNumber = 1;
          } else if (startTimeNumber === 11 && AMPM === "AM") {
              endTimeNumber = 12;
              AMPM = "PM";
          } else if (startTimeNumber === 11 && AMPM === "PM") {
              endTimeNumber = 12;
              AMPM = "AM";
          } else {
              endTimeNumber = startTimeNumber + 1;
          }
          var endTime = endTimeNumber + ":00 " + AMPM;
          var transaction = {
              userId: user._id,
              type: "schedule",

              date: Date.now(),
              time: selectedTime,
              session: {
                  createdAt: Date.now(),
                  providerId: provider.id || provider._id,
                  gigId: gigId,
                  gigName: gig.name,
                  startDate: selectedDate,
                  startTime: selectedTime,
                  endTime: endTime,
                  organizerName: provider.providerDetails.name,
                  providerImageId: provider.providerDetails.profileImageId,
                  gigImageId: gig.gigImageId,
                  instruction: gig.instruction
              }
          };

          console.log("saving transaction");
          console.log(transaction);

          try {
            var collection = db.collection('transactions');
              collection.insert({
                  transaction
              });
              callbacks.success(transaction);
          } catch (e) {
              callbacks.failure(e);
          }
        })



    },
    providerSessions(providerId, callbacks) {
      console.log("in server side providerSessions");
      console.log(providerId);
      var collection = db.collection('transactions');
      collection.find({
          "transaction.type": "schedule",
          "transaction.session.providerId": ObjectId(providerId),
          "transaction.status": { $ne: "cancelled" }
      }).toArray(function(err, results) {
        if (err) {
            callbacks.error("Error in db.");
        }
        if (results === null) {
            callbacks.error("No providers avilable.");
        } else {
            console.log(results);
            callbacks.success(results);
        }
      });
    },
    providerTransactions(providerId, callbacks) {
      console.log("in server side getting provider transactions");
      console.log(providerId);
      var collection = db.collection('transactions');
      collection.find({
          "transaction.session.providerId": ObjectId(providerId)
      }).toArray(function(err, results) {
        if (err) {
            callbacks.error("Error in db.");
        }
        if (results === null) {
            callbacks.error("No providers avilable.");
        } else {
            console.log(results);
            callbacks.success(results);
        }
      });
    },
    getTransactions(req, callbacks) {
      var collection = db.collection('transactions');
      collection.find({
          "transaction.userId": req.user._id
      }).toArray(function(err, results) {
        if (err) {
            callbacks.error("Error in db.");
        }
        if (results === null) {
            callbacks.error("No providers avilable.");
        } else {
            callbacks.success(results);
        }
      });
    },
    cancelSession(req,session, callbacks) {
      var collection = db.collection('transactions');
      var sessionDate = new Date(session.createdAt);
      var date = Date.now();
      var difference = Math.abs(sessionDate - date) / (60*60*1000);
      var refundable;
      if (difference > 24) {
        refundable = false;
      } else {
        refundable = true;
      }
      var transaction = {

        userId: req.user._id,
        date: Date.now(),
        type: "cancel",
        refundable,
        session
      };
      try {
          console.log("server cancel session");
          console.log(session.id);;
          collection.insert({
              transaction
          });
          try {
            collection.updateOne({
                "_id": ObjectId(session.id),
            }, {
                $set: {
                    'transaction.status': "cancelled"
                }
            });
            callbacks.success(transaction);
          } catch (e1) {
            callbacks.error(e1);
          }
      } catch (e) {
          callbacks.error(e);
      }
    },
    rateSession(req, rating, text, session, callbacks) {
      var collection = db.collection('ratings');
      var ratingObj = {
        createdAt: Date.now(),
        value: rating,
        comment: text,
        sessionId: session.id,
        providerId: session.providerId,
        gigId: session.gigId
      }
      try {
        collection.insert(ratingObj);
        callbacks.success(ratingObj);
      } catch (e) {
        callbacks.error(e);
      }
    },
    gigSearch(primaryCategory, category, type, callbacks) {
        console.log(primaryCategory);
        console.log(category);
        console.log(type);
        if (type === "secondaryCategory") {
          var collection = db.collection('users');
          collection.find({
              "providerDetails": {
                  $ne: null
              },
              "gigs.primaryCategory": primaryCategory,
              "gigs.secondaryCategory": category
          }).toArray(function(err, results) {
              console.log(results);
              if (err) {
                  callbacks.error("Error in db.");
              }
              if (results === null) {
                  console.log("results is null");
                  callbacks.error("No providers avilable.");
              } else {
                  callbacks.success(results, primaryCategory, category, type);
              }
          });
        } else {
          var collection = db.collection('users');
          collection.find({
              "providerDetails": {
                  $ne: null
              },
              "gigs.primaryCategory": primaryCategory.toLowerCase(),
              "gigs.tertiaryCategory": category
          }).toArray(function(err, results) {
              if (err) {
                  callbacks.error("Error in db.");
              }
              if (results === null) {
                  callbacks.error("No providers avilable.");
              } else {
                  console.log(results);
                  callbacks.success(results, primaryCategory, category, type);
              }
          });
        }
    }
};
module.exports = services;

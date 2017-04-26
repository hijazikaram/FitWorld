var mongodb = require('mongodb').MongoClient;

var bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');

var services = {
  submitProviderApplication(providerApplication,callbacks) {
    var collection = db.collection('providerApplications');
    try {

      console.log("inserting");
      collection.insert(providerApplication, function(err, item){
        console.log("inserted");
        console.log(item);
        console.log(err);
        callbacks.success(item);
      });

    } catch (e) {
      console.log("problem");
      callbacks.error(e);
    }
  },
  changeProviderStatusToDecline(providerId, callbacks) {
    var collection = db.collection('providerApplications');
    console.log(providerId);
    console.log("in not working");

    try {
      collection.updateOne({
          '_id': ObjectId(providerId)
      }, {
          $set: {
              'status': "declined"
          }
      });
      console.log("in success");
      callbacks.success();
    } catch (e) {
      console.log(e);
      callbacks.failure(e);
    }
  },
  changeProviderStatusToAccept(providerId, callbacks) {
    var collection = db.collection('providerApplications');
    console.log(providerId);
    console.log("in not working");

    try {
      collection.updateOne({
          '_id': ObjectId(providerId)
      }, {
          $set: {
              'status': "accepted"
          }
      });
      console.log("in success");
      callbacks.success();
    } catch (e) {
      console.log(e);
      callbacks.failure(e);
    }

  },
  upcomingSessions(providerId, callbacks) {
    console.log("in server side providerSessions");
    console.log(providerId);
    var collection = db.collection('transactions');
    collection.find({
        "transaction.type": "schedule",
        "transaction.session.providerId": ObjectId(providerId),
        "transaction.status": { $ne: "cancelled" },
        "transaction.session.startDate": { $gte: new Date() }
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
  getClients(providerId, callbacks){
    console.log("in server side getClients");
    var collection = db.collection('transactions');
    collection.find({
        $or: [{
          "transaction.type": "purchase",
          "transaction.providerId": providerId
        },
        {
          "transaction.type": "invite",
          "transaction.providerId": providerId
        }]
    }).toArray(function(err, results) {
      if (err) {
          callbacks.error("Error in db: " + err );
      }
      if (results === null) {
          callbacks.error("No clients.");
      } else {
          var userIds = _.map(results, function(t){
            return t.transaction.userId;
          });
          userIds = _.map(_.uniq(userIds), function(uId){ return ObjectId(uId); });
          console.log("found clients");
          console.log(userIds);
          var userCollection = db.collection("users");
          userCollection.find({_id: { $in: userIds }}).toArray(function(err, results){
            if(err){
              callbacks.error("error finding clients: " + err);
            }
            _.each(results, function(u){
              if(u.verificationToken)
                delete u.verificationToken;
              if(u.password)
                delete u.password

            });
            callbacks.success(results);
          });

      }
    });
  }
 };
module.exports = services;

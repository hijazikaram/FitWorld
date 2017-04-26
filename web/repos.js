var customerRepo = require('./customerMongo');
var vendorRepo = require('./vendorMongo');
var authRepo = require('./authMongo');

module.exports = {
  customerRepo,
  vendorRepo,
  authRepo
};

var authRepo = require('./authMongo');
var usersRepo = require('./userMongo');
var chatRepo = require('./chatMongo');
var vidChatRepo = require('./vidChatMongo');
var providersRepo = require('./providerMongo');
module.exports = {
  authRepo,
  usersRepo,
  chatRepo,
  vidChatRepo,
  providersRepo
};

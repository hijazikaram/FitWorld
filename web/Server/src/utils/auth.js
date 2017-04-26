var bcrypt = require("bcryptjs");

module.exports.createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

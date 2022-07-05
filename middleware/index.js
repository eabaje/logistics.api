const authJwt = require('./authJwt');
const verifySignUp = require('./verifySignUp');
const mailFunc = require('./sendEmail');
module.exports = {
  authJwt,
  verifySignUp,
  mailFunc,
};

const controller = require('../controller/upload.controller');
// var passportFacebook = require('../middleware/facebook');
// var passportGoogle = require('../middleware/google');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],
  app.post('/api/upload/uploadImage', controller.uploadImage);

  app.post('/api/upload/uploadDocument', controller.uploadDocument);

 
};

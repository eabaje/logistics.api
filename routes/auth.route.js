const { authJwt } = require('../middleware');
const controller = require('../controller/auth.controller');
// var passportFacebook = require('../middleware/facebook');
// var passportGoogle = require('../middleware/google');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],
  app.post('/api/auth/signup', controller.signup);

  app.post('/api/auth/signin', controller.signin);

  app.put('/api/auth/reset', controller.reset);

  app.get('/api/auth/verify/:token', controller.verify);

  app.get('/api/auth/logout', controller.logout);

  //  app.get('/api/auth/facebook',passportFacebook.authenticate('facebook'));

  // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email,user_photos' }));

  // app.get('/api//facebook/callback',passport.authenticate('facebook', {successRedirect : '/profile',failureRedirect : '/'}));
};

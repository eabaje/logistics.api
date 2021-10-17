const { authJwt } = require('../middleware');
const controller = require('../controller/user.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // app.get("/api/user/all", controller.allAccess);

  // app.get("/api/user/",[authJwt.verifyToken],controller.userBoard);

  // app.get("/api/user/mod",[authJwt.verifyToken, authJwt.isModerator],controller.moderatorBoard);

  // app.get("/api/user/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard);

  app.post('/api/subscription/create', controller.create);

  app.get('/api/subscription/findOne/:subscriptionId', controller.findOne);

  app.get('/api/subscription/findAll', controller.findAll);

  app.get(
    '/api/subscription/findAllUserSubscriptionsByDate/:fromDate/:toDate',
    controller.findAllUserSubscriptionsByDate,
  );

  app.put('/api/subscription/update/:subscriptionId', controller.update);

  app.delete('/api/subscription/delete/:subscriptionId', controller.delete);

  app.delete('/api/subscription/deleteAll', controller.deleteAll);
};

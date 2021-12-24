const { authJwt } = require('../middleware');
const controller = require('../controller/subscribe.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // app.get("/api/user/all", controller.allAccess);

  // app.get("/api/user/",[authJwt.verifyToken],controller.userBoard);

  // app.get("/api/user/mod",[authJwt.verifyToken, authJwt.isModerator],controller.moderatorBoard);

  // app.get("/api/user/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard);
  // [authJwt.verifyToken],

  app.post('/api/subscription/create', controller.create);

  app.get('/api/subscription/findOne/:subscribeId', controller.findOne);

  app.get('/api/subscription/findAll', controller.findAll);

  app.get('/api/subscription/findAllSubscriptionsByActive/:Active', controller.findAllSubscriptionsByActive);

  app.get('/api/subscription/findAllSubscriptionsByDate/:startDate/:endDate', controller.findAllSubscriptionsByDate);

  app.put('/api/subscription/update/:subscriptionId', controller.update);

  app.delete('/api/subscription/delete/:subscriptionId', controller.delete);

  app.delete('/api/subscription/deleteAll', controller.deleteAll);
};

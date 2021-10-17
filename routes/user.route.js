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

  app.post('/api/user/create', controller.create);

  app.get('/api/user/findOne/:userId', controller.findOne);

  app.get('/api/user/findAll', controller.findAll);

  app.get('/api/user/findAllUsersByDate/:fromDate/:toDate', controller.findAllUsersByDate);

  app.put('/api/user/update/:userId', controller.update);

  app.post('/api/user/delete', controller.delete);

  app.post('/api/user/deleteAll', controller.deleteAll);

  app.post('/api/user/subscribe', controller.subscribe);

  app.post('/api/user/upgradeUserSubscription', controller.upgradeUserSubscription);

  app.put('/api/user/updateUserSubscription/:UserSubscriptionId', controller.updateUserSubscription);

  app.get('/api/user/findUserSubscription/:userId', controller.findUserSubscription);

  app.get('/api/user/findAllUserSubscriptions/', controller.findAllUserSubscriptions);

  app.get('/api/user/findAllUserSubscriptionsByDate/:fromDate/:toDate', controller.findAllUserSubscriptionsByDate);

  app.get(
    '/api/user/findAllUserSubscriptionsByStartDate/:fromDate/:toDate',
    controller.findAllUserSubscriptionsByStartDate,
  );

  app.get(
    '/api/user/findAllUserSubscriptionsByEndDate/:fromDate/:toDate',
    controller.findAllUserSubscriptionsByEndDate,
  );

  app.post('/api/user/delete', controller.delete);

  app.post('/api/user/createCompany', controller.createCompany);

  app.put('/api/user/updateCompany/:CompanyId', controller.updateCompany);

  app.get('/api/user/findCompany/:CompanyId', controller.findCompany);

  app.get('/api/user/findAllCompanys/', controller.findAllCompanys);

  app.get('/api/user/findAllCompanysByDate/:fromDate/:toDate', controller.findAllCompanysByDate);

  app.get('/api/user/findAllCompanysByDate/:fromDate/:toDate', controller.findAllCompanysByDate);

  app.delete('/api/user/deleteCompany/:CompanyId', controller.deleteCompany);
};

const { authJwt } = require('../middleware');
const controller = require('../controller/carrier.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/carrier/findOne/:carrierId', controller.findOne);

  app.get('/api/carrier/findAll', controller.findAll);

  app.get('/api/carrier/findAllCarriersLicensed', controller.findAllCarriersLicensed);

  app.get('/api/carrier/findAllCarriersByDate/:startDate/:endDate', controller.findAllCarriersByDate);

  app.post('/api/carrier/create', [authJwt.verifyToken], controller.create);

  app.post('/api/carrier/update/:carrierId', [authJwt.verifyToken], controller.update);

  app.delete('/api/carrier/delete/:carrierId', [authJwt.verifyToken], controller.delete);

  app.delete('/api/carrier/deleteAll', [authJwt.verifyToken], controller.deleteAll);
};

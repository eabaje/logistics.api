const { authJwt } = require('../middleware');
const controller = require('../controller/carrier.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
//,[authJwt.verifyToken]
  app.get('/api/carrier/findOne/:carrierId', controller.findOne);

  app.get('/api/carrier/findAll', controller.findAll);

  app.get('/api/carrier/findAllCarriersByCompany/:companyId', controller.findAllCarriersByCompany);

  app.get('/api/carrier/findAllCarriersLicensed', controller.findAllCarriersLicensed);

  app.get('/api/carrier/findAllCarriersByDate/:startDate/:endDate', controller.findAllCarriersByDate);

  app.post('/api/carrier/create',  controller.create);

  app.put('/api/carrier/update/:carrierId',  controller.update);

  app.delete('/api/carrier/delete/:carrierId', controller.delete);

  app.delete('/api/carrier/deleteAll', controller.deleteAll);
};

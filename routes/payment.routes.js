const { authJwt } = require('../middleware');
const controller = require('../controller/payment.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/payment/findOne/:paymentId', controller.findOne);

  // app.get('/api/payment/findAll', controller.findAll);

  app.get('/api/payment/findAllPaymentsByDate/:startDate/:endDate', controller.findAllPaymentsByDate);

  app.post('/api/payment/create', controller.create);

  app.post('/api/payment/update/:id', controller.update);

  app.delete('/api/payment/delete/:paymentId', controller.delete);

  app.delete('/api/payment/deleteAll', controller.deleteAll);
};

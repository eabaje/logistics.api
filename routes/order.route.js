const { authJwt } = require('../middleware');
const controller = require('../controller/order.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/order/findOne/:orderId', controller.findOne);

  app.get('/api/order/findAll', controller.findAll);

  app.get('/api/order/findAllOrdersByDate/:startDate/:endDate', controller.findAllOrdersByDate);

  app.post('/api/order/create', controller.create);

  app.post('/api/order/update/:orderId', controller.update);

  app.post('/api/order/delete/:orderId', controller.delete);

  app.post('/api/order/deleteAll', controller.deleteAll);
};

const { authJwt } = require('../middleware');
const controller = require('../controller/shipment.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/shipment/findOne/:shipmentid', controller.findOne);

  app.get('/api/shipment/findAll', controller.findAll);

  app.get('/api/shipment/findAllShipmentsByStatus/:shipmentStatus/:shipmentid', controller.findAllShipmentsByStatus);

  app.get('/api/shipment/findAllShipmentsByDeliveryDate/:fromDate/:endDate', controller.findAllShipmentsByDeliveryDate);

  app.get('/api/shipment/findAllShipmentsByPickUpDate/:fromDate/:endDate', controller.findAllShipmentsByPickUpDate);

  app.get('/api/shipment/findAllShipmentsByRecordDate/:fromDate/:endDate', controller.findAllShipmentsByRecordDate);

  app.get('/api/shipment/findAllShipmentsAssigned/:shipmentid/:assignedshipment', controller.findAllShipmentsAssigned);

  app.post('/api/shipment/create', [authJwt.verifyToken], controller.create);

  app.put('/api/shipment/update/:shipmentId', [authJwt.verifyToken], controller.update);

  app.delete('/api/shipment/delete/:shipmentId', [authJwt.verifyToken], controller.delete);

  app.delete('/api/shipment/deleteAll', controller.deleteAll);
};

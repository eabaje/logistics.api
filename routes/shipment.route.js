const { authJwt } = require('../middleware');
const controller = require('../controller/shipment.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/shipment/findOne/:shipmentId', controller.findOne);

  app.get('/api/shipment/findAll', controller.findAll);

  app.get('/api/shipment/findAllShipmentsByStatus/:shipmentStatus/:shipmentid', controller.findAllShipmentsByStatus);

  app.get(
    '/api/shipment/findAllShipmentsByDeliveryDate/:startDate/:endDate',
    controller.findAllShipmentsByDeliveryDate,
  );
  // [authJwt.verifyToken],
  app.get('/api/shipment/findAllShipmentsByPickUpDate/:startDate/:endDate', controller.findAllShipmentsByPickUpDate);

  app.get('/api/shipment/findAllShipmentsByRecordDate/:startDate/:endDate', controller.findAllShipmentsByRecordDate);

  app.get('/api/shipment/findAllShipmentsAssigned/:shipmentid/:assignedshipment', controller.findAllShipmentsAssigned);

  app.get('/api/shipment/findAllShipmentsInterest', controller.findAllShipmentsInterest);

  app.post('/api/shipment/showInterest', controller.showInterest);

  app.post('/api/shipment/create', controller.create);

  app.put('/api/shipment/update/:shipmentId', controller.update);

  app.delete('/api/shipment/delete/:shipmentId', controller.delete);

  app.delete('/api/shipment/deleteAll', controller.deleteAll);
};

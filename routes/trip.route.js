const { authJwt } = require('../middleware');
const controller = require('../controller/trip.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/trip/create', controller.create);

  app.get('/api/trip/findOne/:tripId', controller.findOne);

  app.get('/api/trip/findAll', controller.findAll);

  app.get('/api/trip/findTripByShipment/:shipmentId', controller.findTripByShipment);

  app.get('/api/trip/findAllTripsByVehicle/:vehicleId/:fromDate/:endDate', controller.findAllTripsByVehicle);

  app.get('/api/trip/findAllTripsByDriver/:driverId/:fromDate/:endDate', controller.findAllTripsByDriver);

  app.get('/api/trip/findAllTripsByPickUpLocation/:pickUpLocation', controller.findAllTripsByPickUpLocation);

  app.get('/api/trip/findAllTripsByDeliveryLocation/:deliveryLocation', controller.findAllTripsByDeliveryLocation);

  app.get('/api/trip/findAllTripsByPickUpDate/:fromDate/:endDate', controller.findAllTripsByPickUpDate);

  app.get('/api/trip/findAllTripsByDeliveryDate/:fromDate/:endDate', controller.findAllTripsByDeliveryDate);

  app.get('/api/trip/findAllTripsByDate/:fromDate/:endDate', controller.findAllTripsByDate);

  app.put('/api/trip/update/:tripId', controller.update);

  app.delete('/api/trip/delete/:tripId', controller.delete);

  app.delete('/api/trip/deleteAll', controller.deleteAll);
};

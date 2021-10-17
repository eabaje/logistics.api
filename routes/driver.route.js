const { authJwt } = require('../middleware');
const controller = require('../controller/driver.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/driver/findOne/:id', controller.findOne);

  app.get('/api/driver/findAll', controller.findAll);

  app.get('/api/driver/findAllDriversByDriverName/:driverName', controller.findAllDriversByDriverName);

  app.get('/api/driver/findAllDriversByVehicle/:vehicleId', controller.findAllDriversByVehicle);

  app.get('/api/driver/findAllDriversLicensed', controller.findAllDriversLicensed);

  app.get('/api/driver/findAllDriversByDate/:fromDate/:endDate', controller.findAllDriversByDate);

  app.get('/api/driver/findAllAssignedDrivers', controller.findAllAssignedDrivers);

  app.post('/api/driver/create', controller.create);

  app.post('/api/driver/AssignDriverToVehicle', controller.AssignDriverToVehicle);

  app.post('/api/driver/update/:driverId', controller.update);

  app.delete('/api/driver/delete/:driverId', controller.delete);

  app.delete('/api/driver/deleteAll', controller.deleteAll);
};

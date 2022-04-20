const { authJwt } = require('../middleware');
const controller = require('../controller/vehicle.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/vehicle/create', controller.create);

  app.get('/api/vehicle/findOne/:vehicleId', controller.findOne);

  app.get('/api/vehicle/findAll', controller.findAll);

  app.get('/api/vehicle/findAllVehiclesInsured', controller.findAllVehiclesInsured);

  app.get('/api/vehicle/findAllVehiclesByCategory/:carrierId/:vehicleType', controller.findAllVehiclesByCategory);

  app.get('/api/vehicle/findAllVehiclesByCompany/:companyId', controller.findAllVehiclesByCompany);

  app.get('/api/vehicle/findAllVehiclesByDate/:startDate/:toDate', controller.findAllVehiclesByDate);

  app.put('/api/vehicle/update/:vehicleId', controller.update);

  app.delete('/api/vehicle/delete/:vehicleId', controller.delete);

  app.delete('/api/vehicle/deleteAll', controller.deleteAll);
};

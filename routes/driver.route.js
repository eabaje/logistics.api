const { authJwt } = require('../middleware');
const controller = require('../controller/driver.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};
const imageUploader = multer({
  storage,
  fileFilter: filter,
});

//const upLoadPics = multer({ storage: storageProfile }).single('file');

storageDocuments = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/docs');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upLoadDocuments = multer({ storage: storageDocuments });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  //, [authJwt.verifyToken]

  app.get('/api/driver/findOne/:driverId', controller.findOne);

  app.get('/api/driver/findAll', controller.findAll);

  app.get('/api/driver/findAllDriversByCompany/:companyId', controller.findAllDriversByCompany);

  app.get('/api/driver/findAllDriversByDriverName/:driverName', controller.findAllDriversByDriverName);

  app.get('/api/driver/findAllDriversByVehicle/:vehicleId', controller.findAllDriversByVehicle);

  app.get('/api/driver/findAllDriversLicensed', controller.findAllDriversLicensed);

  app.get('/api/driver/findAllDriversByDate/:startDate/:endDate', controller.findAllDriversByDate);

  app.get('/api/driver/findAllAssignedDrivers', controller.findAllAssignedDrivers);
  //upLoadDocuments.single('LicenseUrl'), imageUploader.single('PicUrl'),
  app.post('/api/driver/create', imageUploader.single('filePicUrl'), controller.create);
  //[, upLoadDocuments.single('fileLicenseUrl')]
  app.post('/api/driver/AssignDriverToVehicle', controller.AssignDriverToVehicle);

  app.put('/api/driver/update/:driverId', controller.update);

  app.delete('/api/driver/delete/:driverId', controller.delete);

  app.delete('/api/driver/deleteAll', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);
};

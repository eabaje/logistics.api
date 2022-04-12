const { authJwt } = require('../middleware');
const controller = require('../controller/user.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log('req.body', req.body);
    const { Email, CompanyId } = req.body;

    const dir = `./uploads/${req.body.CompanyId}/${req.body.Email}`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
      }
      // fs.access(dir, fs.F_OK, (err) => {
      //   if (err) {
      //     //  console.error(err)
      //     // return fs.mkdirSync(dir, (error) => cb(error, dir));
      //     return fs.mkdirSync(dir, { recursive: true });
      //   }
      cb(null, dir);
      //file exists
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const imageUploader = multer({
  storage,
  // fileFilter: filter,
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // app.get("/api/user/all", controller.allAccess);

  // app.get("/api/user/",[authJwt.verifyToken],controller.userBoard);

  // app.get("/api/user/mod",[authJwt.verifyToken, authJwt.isModerator],controller.moderatorBoard);

  // app.get("/api/user/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard);

  app.post('/api/user/create', controller.create);

  app.get('/api/user/findOne/:userId', controller.findOne);

  app.get('/api/user/findAll', controller.findAll);

  app.get('/api/user/findAllBySearch/:name', controller.findAllBySearch);

  app.get('/api/user/findAllUsersByDate/:startDate/:toDate', controller.findAllUsersByDate);

  app.put('/api/user/update/:userId', controller.update);

  app.post(
    '/api/user/updateFile',

    imageUploader.single('file'),
    controller.updateFile,
  );

  app.post('/api/user/delete', [authJwt.verifyToken], controller.delete);

  app.post('/api/user/deleteAll', controller.deleteAll);

  app.get('/api/user/findRoles', controller.findRoles);

  app.get('/api/user/findUserRoles', controller.findUserRoles);

  app.put('/api/user/updateRole/:roleId', controller.updateRole);

  app.put('/api/user/updateUserRole/:userId', controller.updateUserRole);

  app.delete('/api/user/deleteRole/:roleId', [authJwt.verifyToken], controller.deleteRole);

  app.post('/api/user/subscribe', controller.subscribe);

  app.post('/api/user/upgradeUserSubscription', controller.upgradeUserSubscription);

  app.put('/api/user/updateUserSubscription/:userSubscriptionId', controller.updateUserSubscription);

  app.get('/api/user/findUserSubscription/:userId', controller.findUserSubscription);

  app.get('/api/user/findAllUserSubscriptions/:subscriptionId', controller.findAllUserSubscriptions);

  app.get('/api/user/findAllUserSubscriptionsByDate/:startDate/:toDate', controller.findAllUserSubscriptionsByDate);

  app.get(
    '/api/user/findAllUserSubscriptionsByStartDate/:startDate/:toDate',
    controller.findAllUserSubscriptionsByStartDate,
  );

  app.get(
    '/api/user/findAllUserSubscriptionsByEndDate/:startDate/:toDate',
    controller.findAllUserSubscriptionsByEndDate,
  );

  app.post('/api/user/delete', controller.delete);

  app.post('/api/user/createCompany', controller.createCompany);

  app.put('/api/user/updateCompany/:companyId', controller.updateCompany);

  app.get('/api/user/findCompany/:companyId', controller.findCompany);

  app.get('/api/user/findAllCompanys/', controller.findAllCompanys);

  app.get('/api/user/findAllCompanysByDate/:startDate/:toDate', controller.findAllCompanysByDate);

  app.delete('/api/user/deleteCompany/:companyId', controller.deleteCompany);
};

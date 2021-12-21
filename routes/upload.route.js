const controller = require('../controller/upload.controller');
// var passportFacebook = require('../middleware/facebook');
// var passportGoogle = require('../middleware/google');

const multer = require('multer');
const path = require('path');

storageProfile = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/pics');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upLoadPics = multer({
  storage: storageProfile,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
}).single('file');

//const upLoadPics = multer({ storage: storageProfile }).single('file');

storageDocuments = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/docs');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upLoadDocuments = multer({ storage: storageDocuments }).single('file');

var upload = multer({ storage: storageProfile }).single('file');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],
  app.post('/api/upload/uploadImage', upLoadPics, controller.uploadImage);

  app.post('/api/upload/uploadDocument', upLoadDocuments, controller.uploadDocument);
};

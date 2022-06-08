const controller = require('../controller/upload.controller');
// var passportFacebook = require('../middleware/facebook');
// var passportGoogle = require('../middleware/google');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

storageProfile = multer.diskStorage({
  destination: (req, res, cb) => {
    const { RefId, UploadType } = req.body;

    const dir = path.resolve(`${process.env.UPLOADS_URL}/${UploadType}/${RefId}`);
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
      }

      cb(null, dir);
      //file exists
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

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
});

//const upLoadPics = multer({ storage: storageProfile }).single('file');

storageDocuments = multer.diskStorage({
  destination: (req, res, cb) => {
    const { RefId, UploadType } = req.body;

    const dir = path.resolve(`${process.env.UPLOADS_URL}/${UploadType}/${RefId}`);
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
      }

      cb(null, dir);
      //file exists
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upLoadDocuments = multer({ storage: storageDocuments });

var upload = multer({ storage: storageProfile }).single('file');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],upLoadPics,

  app.get('/api/upload/getFiles/:refId/:fileType*?', controller.getFiles);

  app.post('/api/upload/uploadImage', imageUploader.single('filePicUrl'), controller.uploadImage);

  app.post('/api/upload/uploadDocument', upLoadDocuments.single('doc'), controller.uploadDocument);

  app.post('/api/upload/updateDocument', upLoadDocuments.single('doc'), controller.updateDocument);

  app.post('/api/upload/uploadImageWithData', imageUploader.single('file'), controller.uploadImageWithData);

  app.post('/api/upload/updateImageWithData', imageUploader.single('file'), controller.updateImageWithData);

  app.delete('/api/upload/deleteFile/:mediaId', controller.deleteFile);

  app.delete('/api/upload/deleteFiles/:refId', controller.deleteFiles);
};

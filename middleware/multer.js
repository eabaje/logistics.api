const multer = require("multer");
const path = require("path");


var storageProfile= multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, " './uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


 var upLoadProfile =  multer({
  storage: storageProfile,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});




var storageDocuments = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null,  './uploads/docs');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

 var upLoadDocuments = multer({ storage: storageDocuments });

module.exports = {upLoadProfile,upLoadDocuments};

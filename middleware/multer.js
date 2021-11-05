import multer from 'multer';
import path from 'path';

var storageProfile = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/profile');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

export const upLoadsProfile = multer({ storage: storageProfile });

var storageProducts = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/Products');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

export const upLoadsProducts = multer({ storage: storageProducts });

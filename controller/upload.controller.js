const multer = require('multer');
const path = require('path');
const multerOpt = require('../middleware/multer');
const sharp = require('sharp');
const fs = require('fs');

exports.uploadImage = function (req, res) {
  //, err
  // if (err instanceof multer.MulterError) {
  //   return res.status(500).send({
  //     message: err.message || 'Some error occurred uploading files.',
  //   });
  // } else if (err) {
  //   return res.status(500).send({
  //     message: err.message || 'Some error occurred uploading files.',
  //   });
  // }

  const { filename: image } = req.file;
  console.log(`imagefile0`, req.file.path);
  sharp(req.file.path)
    .resize(200, 200)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(req.file.destination, 'resized', image));
  fs.unlinkSync(req.file.path);

  console.log(`imagefile`, req.file);
  return res.status(200).send(req.file);
};

exports.uploadDocument = function (req, res) {
  // if (err instanceof multer.MulterError) {
  //   return res.status(500).send({
  //     message: err.message || 'Some error occurred uploading files.',
  //   });
  // } else if (err) {
  //   return res.status(500).send({
  //     message: err.message || 'Some error occurred uploading files.',
  //   });
  // }
  console.log(`docfile`, req.file);
  return res.status(200).send(req.file);
};

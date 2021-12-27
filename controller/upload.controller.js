const multer = require('multer');
const path = require('path');
const multerOpt = require('../middleware/multer');
const sharp = require('sharp');
const fs = require('fs');
var Jimp = require('jimp');
const db = require('../models/index.model');

const Media = db.media;

const Op = db.Sequelize.Op;

exports.uploadImage = async function (req, res) {
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
  // Jimp.read(req.file.path)
  // .then(image => {
  //   return image
  //     .resize(256, 256) // resize
  //     .quality(60) // set JPEG quality
  //     .greyscale() // set greyscale
  //     .write(path.resolve(req.file.destination, 'resized', image)); // save

  // })
  // .catch(err => {
  //   console.log(`Error`, err.message);
  //   return res.status(500).send({
  //         message: err.message || 'Some error occurred uploading files.',
  //       });
  // });
  // console.log(`imagefile`, req.file);
  //     return res.status(200).send(req.file);
  // const { filename: image } = req.file;
  try {
    const picpath = path.resolve(
      `uploads/pics/${req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)}`,
    );
    console.log(`imagefile0`, picpath);

    await sharp(req.file.buffer).resize(200, 200).toFormat('jpeg').jpeg({ quality: 90 }).toFile(picpath);

    console.log(`imagefile`, req.file);
    return res.status(200).send({
      filename: req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname),
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};


exports.uploadImageWithData = async function (req, res) {
  
  const { filename: image } = req.file;
  
  try {
    const picpath = path.resolve(
      `uploads/pics/${req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)}`,
    );
    console.log(`imagefile0`, picpath);

    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(picpath);

    console.log(`imagefile`, req.file);

    const picurl= req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
    Media.create({
      RefId: req.body.RefId,
      url: picurl,
      UploadDate:  new Date(),
     
    })
    
    return res.status(200).send({
      filename: picurl,
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};



exports.uploadDocument = function (req, res) {
  try {
    console.log(`docfile`, req.file);
    return res.status(200).send({
      filename: req.file.filename,
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

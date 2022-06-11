const multer = require('multer');
const path = require('path');
const multerOpt = require('../middleware/multer');
const sharp = require('sharp');
const fs = require('fs');
const fsPromises = require('fs').promises;
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

exports.uploadImageWithData1 = async function (req, res) {
  const { filename: image } = req.file;

  try {
    const picName = req.file.fieldname + '-' + Date.now();
    const picurl = picName + path.extname(req.file.originalname);
    const thumbnailurl = picName + '_thumb' + path.extname(req.file.originalname);
    const thumbpath = path.resolve(`uploads/pics/${thumbnailurl}`);
    const picpath = path.resolve(`uploads/pics/${picurl}`);
    console.log(`imagefile0`, picpath);

    await sharp(req.file.buffer)
      .resize({ fit: sharp.fit.contain, width: 200 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(thumbpath);

    await sharp(req.file.buffer)
      .resize({ fit: sharp.fit.contain, width: 500 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(picpath);

    console.log(`imagefile`, req.file);

    Media.create({
      RefId: req.body.RefId,
      FileName: req.file.originalname,
      FileType: req.file.mimetype,
      url: picurl,
      ThumbUrl: thumbnailurl,
      UploadDate: new Date(),
    });

    return res.status(200).send({
      filename: picurl,
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

exports.uploadImageWithData = async function (req, res) {
  const { filename: image } = req.file;
  const RefId = req.body.RefId;
  const uploadUrl = req.body.uploadUrl;

  // const dir = `./uploads/${req.body.CompanyId}/${req.body.Email}`;
  const dir = `${process.env.UPLOADS_URL}/${uploadUrl}/${RefId}`;
  fs.exists(dir, (exist) => {
    if (!exist) {
      return fs.mkdir(dir, { recursive: true }, (err, info) => {
        console.log(err);
      });
    }
  });
  // const dir = `${process.env.UPLOADS_URL}/${UploadType}/${RefId}`;

  try {
    const picName = req.file.fieldname + '-' + Date.now();
    const picurl = picName + path.extname(req.file.originalname);
    const thumbnailurl = picName + '_thumb' + path.extname(req.file.originalname);
    const thumbpath = path.resolve(`${dir}/${thumbnailurl}`);
    const picpath = path.resolve(`${dir}/${picurl}`);
    console.log(`imagefile0`, picpath);

    await sharp(req.file.buffer)
      .resize({ fit: sharp.fit.contain, width: 200 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(thumbpath);

    await sharp(req.file.buffer)
      .resize({ fit: sharp.fit.contain, width: 500 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(picpath);

    console.log(`imagefile`, req.file);
    // ImgPath=
    // ThumbPath
    Media.create({
      RefId: req.body.RefId,
      FileName: req.file.originalname,
      FileType: req.file.mimetype,
      ImgPath: `${dir}/${picurl}`,
      ThumbPath: `${dir}/${thumbnailurl}`,
      UploadDate: new Date(),
    });

    return res.status(200).send({
      filename: picurl,
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error.message}`);
  }
};

exports.updateImageWithData = async function (req, res) {
  const { filename: image } = req.file;
  const RefId = req.body.RefId;
  const uploadUrl = req.body.UploadUrl;
  const dir = `${process.env.UPLOADS_URL}/${uploadUrl}/${RefId}`;
  try {
    const foundMedia = Media.findOne({
      where: { MediaId: req.body.MediaId },
    });

    if (foundMedia) {
      fs.exists(path.resolve(`${foundMedia.ImgPath}`), (exist) => {
        if (exist) {
          fs.unlink(path.resolve(`${foundMedia.ImgPath}`));
          fs.unlink(path.resolve(`${foundMedia.ThumbPath}`));
        }
      });

      //  const dir = `${process.env.UPLOADS_URL}/${foundMedia.UploadType}/${foundMedia.RefId}`;
      const picName = req.file.fieldname + '-' + Date.now();
      const picurl = picName + path.extname(req.file.originalname);
      const thumbnailurl = picName + '_thumb' + path.extname(req.file.originalname);
      const thumbpath = path.resolve(`${dir}/${thumbnailurl}`);
      const picpath = path.resolve(`${dir}/${picurl}`);
      console.log(`imagefile0`, picpath);

      await sharp(req.file.buffer)
        .resize({ fit: sharp.fit.contain, width: 200 })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(thumbpath);

      await sharp(req.file.buffer)
        .resize({ fit: sharp.fit.contain, width: 500 })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(picpath);

      //console.log(`imagefile`, req.file);
      const updateMedia = Media.update(
        {
          RefId: req.body.RefId,
          FileName: req.file.originalname,
          FileType: req.file.mimetype,
          ImgPath: `${dir}/${picurl}`,
          ThumbPath: `${dir}/${thumbnailurl}`,
          updatedAt: new Date(),
        },
        {
          where: { MediaId: req.body.MediaId },
        },
      );
      if (updateMedia) {
        return res.status(200).send({
          filename: picurl,
        });
      }
    }
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

exports.getFiles = (req, res) => {
  const refId = req.params.refId;
  const fileType = req.params.fileType;
  var condition =
    fileType !== undefined ? { RefId: refId, FileType: { [Op.iLike]: `%${fileType}%` } } : { RefId: refId };
  console.log('condition', condition);
  Media.findAll({
    where: condition,
    // include: {
    //   model: Trip,
    //   attributes: ['DeliveryDate', 'PickUpDate', 'PickUpLocation', 'DeliveryLocation'],
    // },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log('err', err);
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving files.',
      });
    });
};

exports.uploadDocument = function (req, res) {
  try {
    const { filename: image } = req.file;
    const RefId = req.body.RefId;
    const UploadType = req.body.UploadType;
    const dir = `${process.env.UPLOADS_URL}/${UploadType}/${RefId}`;
    console.log(`docfile`, req.file);

    const picName = req.file.fieldname + '-' + Date.now();
    const picurl = picName + path.extname(req.file.originalname);

    // if (foundMedia) {
    //   fs.exists(path.resolve(`${foundMedia.ImgPath}`), (exist) => {
    //     if (exist) {
    //       fs.unlink(path.resolve(`${foundMedia.ImgPath}`));
    //       fs.unlink(path.resolve(`${foundMedia.ThumbPath}`));
    //     }
    //   });

    Media.create({
      RefId: req.body.RefId,
      FileName: req.file.originalname,
      FileType: req.file.mimetype,
      ImgPath: `${dir}/${picurl}`,
      UploadDate: new Date(),
    });

    return res.status(200).send({
      filename: req.file.filename,
    });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

exports.updateDocument = function (req, res) {
  try {
    const { filename: image } = req.file;
    const RefId = req.body.RefId;
    const UploadType = req.body.UploadType;
    const dir = `${process.env.UPLOADS_URL}/${UploadType}/${RefId}`;
    console.log(`docfile`, req.file);

    const foundMedia = Media.findOne({
      where: { MediaId: req.body.MediaId },
    });

    if (foundMedia) {
      fs.exists(path.resolve(`${foundMedia.ImgPath}`), (exist) => {
        if (exist) {
          fs.unlink(path.resolve(`${foundMedia.ImgPath}`));
        }
      });
    }
    const picName = req.file.fieldname + '-' + Date.now();
    const picurl = picName + path.extname(req.file.originalname);

    // if (foundMedia) {
    //   fs.exists(path.resolve(`${foundMedia.ImgPath}`), (exist) => {
    //     if (exist) {
    //       fs.unlink(path.resolve(`${foundMedia.ImgPath}`));
    //       fs.unlink(path.resolve(`${foundMedia.ThumbPath}`));
    //     }
    //   });

    const updateMedia = Media.update(
      {
        RefId: req.body.RefId,
        FileName: req.file.originalname,
        FileType: req.file.mimetype,
        ImgPath: `${dir}/${picurl}`,
        updatedAt: new Date(),
      },
      {
        where: { MediaId: req.body.MediaId },
      },
    );

    if (updateMedia) {
      return res.status(200).send({
        filename: picurl,
      });
    }
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

exports.deleteFile = (req, res) => {
  const mediaId = req.params.mediaId;

  Media.findAll({
    where: { MediaId: mediaId },
  })

    .then((files) => {
      if (fs.existsSync(path.join(__dirname, files.ImgPath))) {
        fsPromises.unlink(path.join(__dirname, files.ImgPath));
        fsPromises.unlink(path.join(__dirname, files.ThumbPath));

        Media.destroy({ where: { MediaId: files.MediaId } }).then((num) => {
          if (num == 1) {
            res.send({
              message: 'Picture deleted successfully!',
            });
          }
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving files.',
      });
    });
};

exports.deleteFiles = (req, res) => {
  const id = req.params.refId;

  //Delete all files
  Media.findAll({
    where: { RefId: refId },
  })

    .then((files) => {
      if (fs.existsSync(path.join(__dirname, files.ImgPath))) {
        fsPromises.unlink(path.join(__dirname, files.ImgPath));
        fsPromises.unlink(path.join(__dirname, files.ThumbPath));

        const del = Media.destroy({ where: { MediaId: files.MediaId } });
      }
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Pictures deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving files.',
      });
    });
};

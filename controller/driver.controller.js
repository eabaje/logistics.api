const db = require('../models/index.model');
var generator = require('generate-password');

const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const multer = require('multer');
//const MulterSharpResizer = require('multer-sharp-resizer');
const multerOpt = require('../middleware/multer');
const sharp = require('sharp');
const fs = require('fs');
const { exit } = require('process');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { mailFunc } = require('../middleware');

const Driver = db.driver;
const AssignDriver = db.assigndriver;
const Vehicle = db.vehicle;
const User = db.user;
const Company = db.company;
const Role = db.role;
const UserRole = db.userrole;
const Op = db.Sequelize.Op;

// Create and Save a new Driver
exports.create = async (req, res) => {
  // sharp options

  //
  try {
    const foundDriver = await Driver.findOne({
      where: {
        Email: req.body.Email,
      },
    });

    if (foundDriver) {
      return res.status(404).send({ message: 'Email already exists for Driver' });
      process.exit;
    }

    // const dir = `${process.env.UPLOADS_URL}/${foundDriver.CompanyId}/${foundDriver.Email}`;

    // fs.exists(path.resolve(`${foundDriver.PicUrl}`), (exist) => {
    //   if (exist) {
    //     fs.unlink(path.resolve(`${foundDriver.PicUrl}`));
    //   } else {
    //     return fs.mkdir(dir, { recursive: true }, (err, info) => {
    //       console.log(err);
    //     });
    //   }
    // });

    const picFile = req.files.filePicUrl[0] ? req.files.filePicUrl[0] : null;

    const licenseFile = req.files.fileLicenseUrl[0] ? req.files.fileLicenseUrl[0] : null;

    const newFileName = picFile.fieldname + '-' + Date.now() + path.extname(picFile.originalname);

    const picpath = picFile
      ? `${process.env.UPLOADS_URL}/${req.body.CompanyId}/${req.body.Email}/${picFile.originalname}`
      : '';

    const licensepath = licenseFile
      ? `${process.env.UPLOADS_URL}/${req.body.CompanyId}/${req.body.Email}/${licenseFile.originalname}`
      : '';

    // await sharp(req.file.buffer).resize(200, 200).toFormat('jpeg').jpeg({ quality: 90 }).toFile(picpath);

    const { filename: image } = req.files.filePicUrl[0];

    console.log('picFile', picFile);

    //  const picpath = path.resolve(`${dir}/${picurl}`);
    console.log(`imagefile0`, picpath);

    // await sharp(req.file.buffer)
    //   .resize({ fit: sharp.fit.contain, width: 200 })
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 })
    //   .toFile(picpath);

    await sharp(picFile.path)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(picFile.destination, newFileName));
    // fs.unlinkSync(picFile.path);

    // await sharp(req.file.buffer)
    //   .resize({ fit: sharp.fit.contain, width: 500 })
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 })
    //   .toFile(picpath);

    const generatedPassword = generator.generate({ length: 8, numbers: true });
    const encryptedPassword = req.body.Password
      ? bcrypt.hashSync(req.body.Password, 10)
      : bcrypt.hashSync(generatedPassword, 10);
    // Create a Driver
    const driver = {
      CompanyId: req.body.CompanyId,
      DriverName: req.body.DriverName,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Address: req.body.Address,
      DOB: req.body.DOB,
      City: req.body.City,
      Region: req.body.Region,
      Country: req.body.Country,
      PicUrl: newFileName, // req.PicUrl.fieldname + '-' + Date.now() + path.extname(req.PicUrl.originalname),
      LicenseNo: req.body.LicenseNo,
      Rating: req.body.Rating,
      DriverDocs: licensepath,
    };

    const user = {
      CompanyId: req.body.CompanyId,
      FullName: req.body.DriverName,
      Email: req.body.Email.toLowerCase(),
      Phone: req.body.Phone,
      Address: req.body.Address,
      City: req.body.Region,
      Region: req.body.Region,
      Country: req.body.Country,
      UserName: req.body.Email.toLowerCase(),
      Password: encryptedPassword,
    };
    console.log(`driver`, driver);

    // Save Driver in the database
    const newUser = await User.create(user);
    if (newUser) {
      console.log('data', newUser);
      const newDriver = await Driver.create({
        CompanyId: req.body.CompanyId,
        DriverName: req.body.DriverName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Address: req.body.Address,
        DOB: req.body.DOB,
        City: req.body.City,
        Region: req.body.Region,
        Country: req.body.Country,
        PicUrl: picpath,
        LicenseNo: req.body.LicenseNo,
        DriverDocs: licensepath,
        UserId: newUser.UserId,
      });

      if (newDriver) {
        const foundRole = await Role.findOne({ where: { Name: 'driver' } });

        if (foundRole) {
          const newUserRole = await UserRole.create({ UserId: newUser.UserId, RoleId: foundRole.RoleId });
        }

        await mailFunc.sendEmail({
          template: 'emailPassword',
          subject: 'Welcome to Global Load Dispatch',
          toEmail: newDriver.Email,
          msg: {
            name: newDriver.DriverName,
            password: generatedPassword,
            // url: url,
          },
        });

        res.send({
          message: 'Driver was added successfully.',
          data: newDriver,
        });
      }
    }
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);

    res.status(500).send({
      message: error.message || 'Some error occurred while creating the Driver.',
    });
  }

  //  await sharp(picFile.path)
  //     .resize(200, 200)
  //     .jpeg({ quality: 90 })
  //     .toFile(
  //       path.resolve(picFile.destination , 'resized', image), //, (err, info) => {
  //       //   console.log(err);}+ `/${newFileName}`
  //     );
  // await sharp(picFile.path)
  //   .resize(500)
  //   .jpeg({ quality: 50 })
  //   .toFile(path.resolve(picFile.destination, 'resized', image));
  //fs.unlinkSync(picFile.path);
  //fs.unlinkSync(req.files.filePicUrl[0].path);

  // filename: req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)
};

exports.sendDriverRegistrationLink = async (req, res) => {
  try {
    const { Email, DriverName, CompanyId } = req.body;

    const company = await Company.findOne({ where: { CompanyId: CompanyId } });

    const url = `${process.env.MAIN_SITE_URL}` + `driver/register/?companyId=${CompanyId}`;
    const link = '<a href=' + url + '>Register</a>';
    await mailFunc.sendEmail({
      template: 'driver',
      subject: 'Welcome to Global Load Dispatch',
      toEmail: Email,
      msg: {
        name: DriverName,
        msg: `
          
          To sign up as a driver with  ${company.CompanyName}, kindly click the link below
           `,
        url: url,
      },
    });
    return res.status(200).json({
      message: 'Registration Link Sent',
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred .',
    });
  }
};

// Retrieve all Drivers start the database.
exports.findAll = (req, res) => {
  const CompanyId = req.params.CompanyId;
  var condition = CompanyId ? { CompanyId: { [Op.eq]: CompanyId } } : null;

  Driver.findAll({
    where: condition,

    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Vehicle,

        attributes: ['VehicleNumber', 'VehicleId'],
        through: {
          attributes: ['VehicleId', 'DriverId'],
        },
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

// find all Licensed Driver
exports.findAllDriversByDriverName = (req, res) => {
  const driverName = req.params.driverName;

  Driver.findAll({
    where: { DriverName: driverName },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },

    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

exports.findAllDriversByVehicle = (req, res) => {
  const vehicleId = req.params.vehicleId;

  AssignDriver.findAll({
    where: { VehicleId: vehicleId },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

exports.findAllDriversByCompany = (req, res) => {
  const companyId = req.params.companyId;

  Driver.findAll({
    where: { CompanyId: companyId },

    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: User,
        attributes: ['FullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};
exports.findAllAssignedDrivers = (req, res) => {
  //  const vehicleId = req.query.VehicleId;
  const companyId = req.params.companyId;
  var condition = companyId ? { CompanyId: { [Op.eq]: companyId } } : null;
  Driver.findAll({
    where: condition,

    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
        where: { IsVetted: true },
      },
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Vehicle,
        required: true,
        attributes: ['VehicleId', 'VehicleNumber', 'VehicleMake'],
        // through: {
        //   attributes: ["VehicleId","DriverId"],

        //   where:{Assigned:true}
        // }
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

// find all Licensed Driver
exports.findAllDriversLicensed = (req, res) => {
  Driver.findAll({
    where: { Licensed: true },
    order: [['createdAt', 'DESC']],
    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

// find all  Driver by date
exports.findAllDriversByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Driver.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    order: [['createdAt', 'DESC']],

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

// Find a single Driver with an id
exports.findOne = (req, res) => {
  const id = req.params.driverId;

  Driver.findOne({
    where: { [Op.or]: [{ DriverId: id }, { UserId: id }] },
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: User,
        attributes: ['FullName'],
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send({
        message: 'Error retrieving Driver with DriverId=' + id,
      });
    });
};

// Find a single Driver with an id
exports.findOneAssigned = (req, res) => {
  const id = req.params.driverId;

  Driver.findOne({
    where: { [Op.or]: [{ DriverId: id }, { UserId: id }] },
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Vehicle,

        attributes: ['VehicleId', 'VehicleNumber', 'VehicleMake'],
        through: {
          attributes: ['VehicleId'],
          where: { Assigned: true },
        },
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send({
        message: 'Error retrieving Driver with DriverId=' + id,
      });
    });
};

// Update a Driver by the id in the request
exports.update = (req, res) => {
  const id = req.params.driverId;

  const driver = {
    DriverName: req.body.DriverName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Address: req.body.Address,
    DOB: req.body.DOB,
    City: req.body.City,
    Region: req.body.Region,
    Country: req.body.Country,

    Licensed: req.body.Licensed,
  };

  // console.log('req.params.driverId', req.params.driverId);
  // console.log('req.body', req.body);

  Driver.update(req.body, {
    where: { DriverId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Driver was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Driver with id=${id}. Maybe Driver was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Driver with id=' + id,
      });
    });
};

// Update a Driver by the id in the request
exports.updateFile = (req, res) => {
  Driver.findOne({
    where: {
      DriverId: req.body.RefId,
    },
  }).then((driver) => {
    if (driver) {
      const uploadFile = req.file ? req.file : null;

      const picpath = uploadFile ? `${driver.CompanyId}/${driver.Email}/${uploadFile.originalname}` : '';

      var condition = { DriverDocs: picpath };

      Driver.update(condition, {
        where: { DriverId: req.body.RefId },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: 'File uploaded successfully.',
            });
          } else {
            res.send({
              message: `Cannot update Driver with id=${id}. Maybe Driver was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Error updating Driver with id=' + id,
          });
        });
    } else {
      res.status(500).send({
        message: 'Error updating the record',
      });
    }
  });

  // const dir = `./uploads/${req.body.CompanyId}/${req.body.Email}`;
  // fs.exists(dir, (exist) => {
  //   if (!exist) {
  //     return fs.mkdir(dir, { recursive: true }, (err, info) => {
  //          console.log(err);
  //         });
  //   }
  // });
};
exports.updateDriverPic = async (req, res) => {
  try {
    const foundDriver = Driver.findOne({
      where: {
        DriverId: req.body.RefId,
      },
    });

    if (foundDriver) {
      // const dir = `${process.env.UPLOADS_URL}/${foundDriver.CompanyId}/${foundDriver.Email}`;

      // fs.exists(path.resolve(`${foundDriver.PicUrl}`), (exist) => {
      //   if (exist) {
      //     fs.unlink(path.resolve(`${foundDriver.PicUrl}`));
      //   } else {
      //     return fs.mkdir(dir, { recursive: true }, (err, info) => {
      //       console.log(err);
      //     });
      //   }
      // });

      //  const dir = `${process.env.UPLOADS_URL}/${foundMedia.UploadType}/${foundMedia.RefId}`;

      const uploadFile = req.file ? req.file : null;

      const picName = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);

      const picpath = uploadFile ? path.resolve(uploadFile.destination, picName) : '';

      const picRelPath = `${uploadFile.destination}/${picName}`;

      var condition = req.body.FileType === 'image' ? { PicUrl: picRelPath } : { DriverDocs: picRelPath };

      console.log(`imagefile0`, picpath);

      // await sharp(req.file.buffer)
      //   .resize({ fit: sharp.fit.contain, width: 200 })
      //   .toFormat('jpeg')
      //   .jpeg({ quality: 90 })
      //   .toFile(picpath);
      await sharp(uploadFile.path)
        .resize({ fit: sharp.fit.contain, width: 200 })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(picpath);
      // fs.unlinkSync(picFile.path);

      //console.log(`imagefile`, req.file);
      const updateDriver = Driver.update(condition, {
        where: { DriverId: req.body.RefId },
      });
      if (updateDriver) {
        return res.status(200).send({
          filename: picRelPath,
        });
      }
    }
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
};

// Delete a Driver with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.driverId;

  Driver.destroy({
    where: { DriverId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Driver was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Driver with id=${id}. Maybe Driver was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Driver with id=' + id,
      });
    });
};

// Delete all Drivers start the database.
exports.deleteAll = (req, res) => {
  Driver.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Drivers were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Drivers.',
      });
    });
};

// Assign driver to vehicle
exports.AssignDriverToVehicle = (req, res) => {
  const driverId = req.body.DriverId;
  const vehicleId = req.body.VehicleId;
  const assignedDate = new Date();

  //check if vehicle exists in the record

  Vehicle.findOne({ where: { VehicleId: vehicleId } })
    .then((IsVehicle) => {
      if (IsVehicle === null) {
        res.status(500).send({
          message: 'No record of Vehice Id found .',
        });
      } else {
        //
        AssignDriver.findOne({
          where: { VehicleId: vehicleId, Assigned: true },
          // include: [
          //   Driver
          //   // {
          //   //   model: Driver,
          //   //   attributes: ['DriverName'],
          //   // },
          // ],
        }).then((IsAssigned) => {
          Driver.findOne({ where: { DriverId: driverId } }).then((driverObj) => {
            console.log('driverObj', driverObj);
            //check if vehicle has been assigned and unassign it
            if (IsAssigned === null) {
              //Assign New Driver To Vehicle

              //Get driver name

              AssignDriver.create({
                VehicleId: vehicleId,
                DriverId: driverId,
                Assigned: true,
                AssignedDate: assignedDate,
              })

                .then((data) => {
                  res.status(200).send({
                    message: `Vehicle Successfully assigned to Driver ${driverObj.DriverName}`,
                    data: data,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving Drivers.',
                  });
                });
            } else {
              // Unassign it
              AssignDriver.update({ Assigned: false, updatedAt: assignedDate }, { where: { VehicleId: vehicleId } });

              //Assign New Driver To Vehicle

              AssignDriver.create({
                VehicleId: vehicleId,
                DriverId: driverId,
                Assigned: true,
                AssignedDate: assignedDate,
              })
                .then((data) => {
                  res.status(200).send({
                    message: `Vehicle Successfully assigned to Driver ${driverObj.DriverName}`,
                    data: data,
                  });
                })
                .catch((err) => {
                  console.log('err', err);
                  res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving results.',
                  });
                });
            }
          });
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Drivers.',
      });
    });
};

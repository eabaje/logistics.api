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

const Driver = db.driver;
const AssignDriver = db.assigndriver;
const Vehicle = db.vehicle;
const User = db.user;
const Company = db.company;
const Role = db.role;
const UserRole = db.userrole;
const Op = db.Sequelize.Op;

// Create and Save a new Driver
exports.create =  (req, res) => {
  // sharp options

  //
  Driver.findOne({
    where: {
      Email: req.body.Email,
    },
  }).then((user) => {
    if (user) {
      return res.status(404).send({ message: 'Email already exists for Driver' });
      process.exit;
    }
  });

  
  const picFile = req.files.filePicUrl[0] ? req.files.filePicUrl[0] : null;

  const licenseFile = req.files.fileLicenseUrl[0] ? req.files.fileLicenseUrl[0] : null;

  const newFileName = picFile.fieldname + '-' + Date.now() + path.extname(picFile.originalname);
  

  const picpath = picFile ? `${process.env.PROFILE_IMG_URL}/${req.body.CompanyId}/${req.body.Email}/${picFile.originalname}` : '';

  const licensepath = licenseFile ? `${process.env.PROFILE_IMG_URL}/${req.body.CompanyId}/${req.body.Email}/${licenseFile.originalname}` : '';

  // await sharp(req.file.buffer).resize(200, 200).toFormat('jpeg').jpeg({ quality: 90 }).toFile(picpath);

  const { filename: image } = req.files.filePicUrl[0];
  console.log('picFile', picFile);

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
    PicUrl: picpath, // req.PicUrl.fieldname + '-' + Date.now() + path.extname(req.PicUrl.originalname),
    Licensed: req.body.Licensed,
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
  User.create(user)
    .then((userdata) => {
      console.log('data', userdata);
      Driver.create({
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
        Licensed: req.body.Licensed,
        DriverDocs: licensepath,
        UserId: userdata.UserId,
      }).then((driverdata) => {
        console.log('driver', driverdata);

        Role.findOne({
          where: {
            Name: 'driver',
          },
        }).then((role) => {
          UserRole.create({ UserId: userdata.UserId, RoleId: role.RoleId });
        });

        const transporter = nodemailer.createTransport({
          service: `${process.env.MAIL_SERVICE}`,
          auth: {
            user: `${process.env.EMAIL_USERNAME}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });
        // //  mailgun
        // // Step 2 - Generate a verification token with the user's ID
        // const verificationToken = user.generateVerificationToken();
        // // Step 3 - Email the user a unique verification link

        // point to the template folder
        const handlebarOptions = {
          viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
          },
          viewPath: path.resolve('./views/'),
        };

        // use a template file with nodemailer
        transporter.use('compile', hbs(handlebarOptions));

        //   const url = process.env.BASE_URL + `auth/verify/${token}`;
        transporter.sendMail({
          from: process.env.FROM_EMAIL,
          to: req.body.Email,
          template: 'emailPassword', // the name of the template file i.e email.handlebars
          context: {
            name: req.body.DriverName,
            password: generatedPassword,
            // url: url,
          },
          subject: 'Welcome to Global Load Dispatch',
          //     html: `<h1>Email Confirmation</h1>
          // <h2>Hello ${fullname}</h2>

          // <p>By signing up for a free 90 day trial with Load Dispatch Service, you can connect with carriers,shippers and drivers.<br/></p>
          // To finish up the process kindly click on the link to confirm your email <a href = '${url}'>Click here</a>
          // </div>`,
        });

        res.send({
          message: 'Driver was added successfully.',
          data: driverdata,
        });
      });
    })
    .catch((err) => {
      console.log(`err.message`, err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Driver.',
      });
    });
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
         
        attributes: ["VehicleNumber","VehicleId"],
        through: {
          attributes: ["VehicleId", "DriverId"],
        }
      }
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
      }
      
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
  Driver.findAll({  where: condition,
    
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
        required: true,
         attributes: ["VehicleId","VehicleNumber","VehicleMake"],
        // through: {
        //   attributes: ["VehicleId","DriverId"],
          
        //   where:{Assigned:true}
        // }
       
      }
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
      }
      
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
         
        attributes: ["VehicleId","VehicleNumber","VehicleMake"],
        through: {
          attributes: ["VehicleId"],
           where:{Assigned:true}
        }
       
      }
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
      DriverId: req.body.DriverId,
    },
  }).then((driver) => {
    if (driver) {
      const uploadFile = req.file ? req.file : null;

      const picpath = uploadFile ? `${driver.CompanyId}/${driver.Email}/${uploadFile.originalname}` : '';

      var condition = req.body.FileType === 'image' ? { PicUrl: picpath } : { DriverDocs: picpath };
     
      Driver.update(condition, {
        where: { DriverId: req.body.DriverId },
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



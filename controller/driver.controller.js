const db = require('../models/index.model');
var generator = require('generate-password');

const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Driver = db.driver;
const AssignDriver = db.assigndriver;
const Vehicle = db.vehicle;
const User = db.user;
const Company = db.company;
const Op = db.Sequelize.Op;

// Create and Save a new Driver
exports.create = async (req, res) => {
  // const picpath = path.resolve(`uploads/pics/${req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)}`);
  // console.log(`imagefile0`, picpath);

  // await sharp(req.file.buffer)
  // .resize(200, 200)
  // .toFormat("jpeg")
  // .jpeg({ quality: 90 })
  // .toFile(picpath);

  // console.log(`imagefile`, req.file);

  // Create a Driver
  const driver = {
    CompanyId: req.body.CompanyId,
    DriverName: req.body.DriverName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Address: req.body.Address,
    City: req.body.City,
    // Region: req.body.Region,
    Country: req.body.Country,
    PicUrl: req.body.PicUrl, // req.PicUrl.fieldname + '-' + Date.now() + path.extname(req.PicUrl.originalname),
    Licensed: req.body.Licensed,
    LicenseUrl: req.body.LicenseUrl, // req.LicenseUrl.path,
    Rating: req.body.Rating,
    DriverDocs: req.body.DriverDocs,
  };
  const generatedPassword = generator.generate({ length: 8, numbers: true });
  const encryptedPassword = req.body.Password
    ? bcrypt.hashSync(req.body.Password, 10)
    : bcrypt.hashSync(generatedPassword, 10);
  // Save Driver in the database
  Driver.create(driver)
    .then((data) => {
      User.create({
        CompanyId: req.body.CompanyId,
        FullName: req.body.DriverName,
        Email: req.body.Email.toLowerCase(),
        Phone: req.body.Phone,
        Address: req.body.Address,
        City: req.body.Region,
        Country: req.body.Country,
        UserName: req.body.Email.toLowerCase(),
        Password: encryptedPassword,
      }).then((user) => {
        Role.findOne({
          where: {
            Name: 'driver',
          },
        }).then((role) => {
          UserRole.create({ UserId: user.UserId, RoleId: role.RoleId });
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
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
          to: email,
          template: 'emailPassword', // the name of the template file i.e email.handlebars
          context: {
            name: req.body.DriverName,
            password: generatedPassword,
            url: url,
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
          data: data,
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

  Driver.findByPk({
    id,

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
        message: 'Error retrieving Driver with DriverId=' + id,
      });
    });
};

// Update a Driver by the id in the request
exports.update = (req, res) => {
  const id = req.params.driverId;

  Driver.update(req.body, {
    where: { id: id },
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

// Delete a Driver with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.driverId;

  Driver.destroy({
    where: { id: id },
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
  // const assigndriver = {
  //   DriverId: req.body.DriverId,
  //   VehicleId: req.body.Vehicle,
  //   AssignedDate: req.body.AssignedDate,
  // };
  const driverId = req.body.DriverId;
  const vehicleId = req.body.VehicleId;
  const assignedDate = req.body.AssignedDate;

  //check if vehicle exists in the record

  const IsVehicle = Vehicle.findOne({ where: { VehicleId: vehicleId } });
  if (IsVehicle.VehicleId == null) {
    res.status(500).send({
      message: 'No record of Vehice Id found .',
    });
  } else {
    const IsAssigned = AssignDriver.findOne({
      where: { VehicleId: vehicleId, Assigned: true, AssignedDate: assignedDate },
    });
    //check if vehicle has been assigned and unassign it
    if (IsAssigned.AssignId !== null) {
      // Unassign it

      AssignDriver.update({ Assigned: false }, { where: { AssignId: IsAssigned.AssignedId } });

      //Assign New Driver To Vehicle

      AssignDriver.create({ VehicleId: vehicleId, DriverId: driverId, Assigned: true })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: `${err.message} -Bad Operation` || 'Some error occurred while retrieving Drivers.',
          });
        });
    } else {
      //Assign New Driver To Vehicle

      AssignDriver.create({ VehicleId: vehicleId, DriverId: driverId, Assigned: true })

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
    }
  }
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

  AssignDriver.findAll({
    where: { Assigned: true },

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

// find all Licensed Driver
exports.findAllDriversLicensed = (req, res) => {
  Driver.findAll({
    where: { Licensed: true },

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
    order: [['createdAt', 'ASC']],

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

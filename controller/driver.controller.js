const db = require('../models/index.model');
const Driver = db.driver;
const AssignDriver = db.assigndriver;
const Vehicle = db.vehicle;
const Op = db.Sequelize.Op;

// Create and Save a new Driver
exports.create =async (req, res) => {
  
  const picpath = path.resolve(`uploads/pics/${req.PicUrl.fieldname + '-' + Date.now() + path.extname(req.PicUrl.originalname)}`);
  console.log(`imagefile0`, picpath);
  
  await sharp(req.PicUrl.buffer)
  .resize(200, 200)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(picpath);

  console.log(`imagefile`, req.PicUrl);




  // Create a Driver
  const driver = {
    CompanyId: req.body.CompanyId,
    DriverName: req.body.DriverName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Address: req.body.Address,
    City: req.body.City,
    Country: req.body.Country,
    PicUrl: req.PicUrl.fieldname + '-' + Date.now() + path.extname(req.PicUrl.originalname),
    Licensed: req.body.Licensed,
    LicenseUrl: req.LicenseUrl.path,
    Rating: req.body.Rating,
    DriverDocs: req.body.DriverDocs,
  };

  // Save Driver in the database
  Driver.create(driver)
    .then((data) => {
      res.send({
        message: 'Driver was added successfully.',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Driver.',
      });
    });
};

// Retrieve all Drivers start the database.
exports.findAll = (req, res) => {
  const CompanyId = req.params.CompanyId;
  var condition = CompanyId ? { CompanyId: { [Op.eq]: CompanyId } } : null;

  Driver.findAll({ where: condition })

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

  Driver.findByPk(id)

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

  Driver.findAll({ where: { DriverName: driverName } })

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

  AssignDriver.findAll({ where: { VehicleId: vehicleId } })

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

  AssignDriver.findAll({ where: { Assigned: true } })

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
  Driver.findAll({ where: { Licensed: true } })

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

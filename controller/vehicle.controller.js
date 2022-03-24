const { carrier } = require('../models/index.model');
const db = require('../models/index.model');
const Vehicle = db.vehicle;
const Carrier = db.carrier;
const Company = db.company;
const Op = db.Sequelize.Op;

// Create and Save a new Vehicle
exports.create = (req, res) => {
  // // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Vehicle
  const vehicle = {
    CompanyId: req.body.CompanyId,
    CarrierId: req.body.CarrierId,
    VehicleType: req.body.VehicleType,
    VehicleNumber: req.body.VehicleNumber,
    SerialNumber: req.body.SerialNumber,
    VehicleMake: req.body.VehicleMake,
    VehicleColor: req.body.VehicleColor,
    VehicleModel: req.body.VehicleModel,
    LicensePlate: req.body.LicensePlate,
    Description: req.body.Description,
    VehicleModelYear: req.body.VehicleModelYear,
    PurchaseYear: req.body.PurchaseYear,
    Insured: req.body.Insured ? req.body.Insured : false,
    PicUrl: req.body.PicUrl,
    VehicleDocs: req.body.VehicleDocs,
  };

  // Save Vehicle in the database
  Vehicle.create(vehicle)

    .then((data) => {
      res.status(200).send({
        message: 'Vehicle was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log('err', err);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Vehicle.',
      });
    });
};

// Retrieve all Vehicles from the database.
exports.findAll = (req, res) => {
  const vehicleType = req.params.vehicleType;
  var condition = vehicleType ? { VehicleType: { [Op.iLike]: `%${vehicleType}%` } } : null;

  Vehicle.findAll({
    where: condition,

    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: Carrier,
        attributes: ['FleetType', 'ServiceDescription'],
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
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Vehicles.',
      });
    });
};

// Find a single Vehicle with an id
exports.findOne = (req, res) => {
  const id = req.params.vehicleId;

  Vehicle.findOne({
    where: { VehicleId: id },

    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: Carrier,
        attributes: ['FleetType', 'ServiceDescription'],
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
      res.status(500).send({
        message: 'Error retrieving Vehicle with VehicleId=' + id,
      });
    });
};

// Update a Vehicle by the id in the request
exports.update = (req, res) => {
  const id = req.params.vehicleId;

  Vehicle.update(req.body, {
    where: { VehicleId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Vehicle was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Vehicle with id=${id}. Maybe Vehicle was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Vehicle with id=' + id,
      });
    });
};

// Delete a Vehicle with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.vehicleId;

  Vehicle.destroy({
    where: { VehicleId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Vehicle was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Vehicle with id=${id}. Maybe Vehicle was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Vehicle with id=' + id,
      });
    });
};

// Delete all Vehicles from the database.
exports.deleteAll = (req, res) => {
  Vehicle.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Vehicles were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Vehicles.',
      });
    });
};

// find all insured Vehicle
exports.findAllVehiclesInsured = (req, res) => {
  Vehicle.findAll({ where: { Insured: true } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Vehicles.',
      });
    });
};

exports.findAllVehiclesByCategory = (req, res) => {
  const vehicleType = req.params.vehicleType;
  const carrierId = req.params.carrierId;
  // var condition = vehicleType ? { VehicleType: { [Op.iLike]: `%${vehicleType}%` } } : null;

  Vehicle.findAll({
    where: { VehicleType: { [Op.iLike]: `%${vehicleType}%` } },

    include: {
      model: Carrier,
      attributes: ['CarrierType'],
      where: { CarrierId: carrierId },
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`err.message`, err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Vehicles.',
      });
    });
};

exports.findAllVehiclesByCompany = (req, res) => {
  const companyId = req.params.companyId;

  // var condition = vehicleType ? { VehicleType: { [Op.iLike]: `%${vehicleType}%` } } : null;

  Vehicle.findAll({
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
        where: { CompanyId: companyId },
      },
      {
        model: Carrier,
        attributes: ['CarrierType'],
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
      console.log(`err.message`, err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Vehicles.',
      });
    });
};

// find all  Vehicle by date
exports.findAllVehiclesByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
        where: { CompanyId: companyId },
      },
      {
        model: Carrier,
        attributes: ['CarrierType'],
      },
    ],
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
        message: err.message || 'Some error occurred while retrieving Vehicles.',
      });
    });
};

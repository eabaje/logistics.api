const db = require('../models/index.model');
const Shipment = db.shipment;
const User = db.user;
const Company = db.company;
const Interested = db.interested;

const Op = db.Sequelize.Op;

// Create and Save a new Shipment
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Shipment
  const shipment = {
    CompanyId: req.body.CompanyId,
    LoadCategory: req.body.LoadCategory,
    LoadType: req.body.LoadType,
    LoadWeight: req.body.LoadWeight,
    LoadUnit: req.body.LoadUnit,
    Qty: req.body.Qty,
    Description: req.body.Description,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryLocation: req.body.DeliveryLocation,
    PickUpCountry: req.body.PickUpCountry,
    PickUpRegion: req.body.PickUpRegion,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryCountry: req.body.DeliveryCountry,
    DeliveryRegion: req.body.DeliveryRegion,
    DeliveryLocation: req.body.DeliveryLocation,
    ExpectedPickUpDate: req.body.ExpectedPickUpDate,
    ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,
    RequestForShipment: req.body.RequestForShipment,
    ShipmentRequestPrice: req.body.ShipmentRequestPrice,
    DeliveryContactName: req.body.DeliveryContactName,
    DeliveryContactPhone: req.body.DeliveryContactPhone,
    DeliveryEmail: req.body.DeliveryEmail,
    AssignedShipment: req.body.AssignedShipment,
    ShipmentDate: req.body.ShipmentDate,
    ShipmentDocs: req.body.ShipmentDocs,
    ShipmentStatus: req.body.ShipmentStatus,
  };

  // Save Shipment in the database
  Shipment.create(shipment)
    .then((data) => {
      res.status(200).send({
        message: 'Shipment was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log('error:', err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Shipment.',
      });
    });
};

// Retrieve all Shipments start the database.
exports.findAll = (req, res) => {
  const loadCategory = req.params.loadCategory;
  var condition = loadCategory ? { LoadCategory: { [Op.iLike]: `%${loadCategory}%` } } : null;

  Shipment.findAll({
    where: condition,

    include: {
      model: User,
      attributes: ['FullName'],
    },

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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// Find a single Shipment with an id
exports.findOne = (req, res) => {
  const id = req.params.shipmentId;

  Shipment.findOne({
    where: { ShipmentId: id },
    include: {
      model: User,
      attributes: ['FullName'],
    },

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
        message: 'Error retrieving Shipment with ShipmentId=' + id,
      });
    });
};

// Update a Shipment by the id in the request
exports.update = (req, res) => {
  const id = req.params.shipmentId;

  Shipment.update(req.body, {
    where: { ShipmentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Shipment was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Shipment with id=${id}. Maybe Shipment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Shipment with id=' + id,
      });
    });
};

// Delete a Shipment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.ShipmentId;

  Shipment.destroy({
    where: { ShipmentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Shipment was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Shipment with id=${id}. Maybe Shipment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Shipment with id=' + id,
      });
    });
};

// Delete all Shipments start the database.
exports.deleteAll = (req, res) => {
  Shipment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Shipments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Shipments.',
      });
    });
};

// find all insured Shipment
exports.findAllShipmentsByStatus = (req, res) => {
  const status = req.params.shipmentStatus;
  const shipmentId = req.params.shipmentId;
  var condition = shipmentId
    ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
    : { ShipmentStatus: status };

  Shipment.findAll({ where: condition })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsAssigned = (req, res) => {
  const status = req.params.shipmentStatus;
  const assignedshipment = req.params.assignedshipment;
  var condition = shipmentId
    ? { [Op.and]: [{ ShipmentId: shipmentId }, { AssignedShipment: assignedshipment }] }
    : { ShipmentStatus: status };

  Shipment.findAll({ where: condition })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// find all  Shipment by date
exports.findAllShipmentsByDeliveryDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      DeliveryDate: {
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsByPickUpDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
    where: {
      PickUpDate: {
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsByRecordDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Shipment.findAll({
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// Create and Save a new Shipment
exports.create1 = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Shipment
  const shipment = {
    UserId: req.body.UserId,
    LoadCategory: req.body.LoadCategory,
    LoadType: req.body.LoadType,
    LoadWeight: req.body.LoadWeight,
    LoadUnit: req.body.LoadUnit,
    Qty: req.body.Qty,
    Description: req.body.Description,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryLocation: req.body.DeliveryLocation,
    PickUpCountry: req.body.PickUpCountry,
    PickUpRegion: req.body.PickUpRegion,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryCountry: req.body.DeliveryCountry,
    DeliveryRegion: req.body.DeliveryRegion,
    DeliveryLocation: req.body.DeliveryLocation,
    ExpectedPickUpDate: req.body.ExpectedPickUpDate,
    ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,
    RequestForShipment: req.body.RequestForShipment,
    ShipmentRequestPrice: req.body.ShipmentRequestPrice,
    DeliveryContactName: req.body.DeliveryContactName,
    DeliveryContactPhone: req.body.DeliveryContactPhone,
    DeliveryEmail: req.body.DeliveryEmail,
    AssignedShipment: req.body.AssignedShipment,
    ShipmentDate: req.body.ShipmentDate,
    ShipmentDocs: req.body.ShipmentDocs,
    ShipmentStatus: req.body.ShipmentStatus,
  };

  // Save Shipment in the database
  Shipment.create(shipment)
    .then((data) => {
      res.status(200).send({
        message: 'Shipment was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log('error:', err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Shipment.',
      });
    });
};

exports.showInterest = (req, res) => {
  // const assigndriver = {
  //   DriverId: req.body.DriverId,
  //   VehicleId: req.body.Vehicle,
  //   AssignedDate: req.body.AssignedDate,
  // };
  const ShipmentId = req.body.ShipmentId;
  const UserId = req.body.UserId;
  // const InterestDate = req.body.InterestDate;

  //check if vehicle exists in the record

  Interested.findOne({ where: { ShipmentId: ShipmentId, UserId: UserId } })
    .then((IsInterestedResult) => {
      if (IsInterestedResult) {
        Interested.update({ IsInterested: false }, { where: { ShipmentId: ShipmentId, UserId: UserId } })

          .then((data) => {
            res.status(200).send({
              message: 'Withdrawn Interest',
              data: data,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: `${err.message} -Bad Operation` || 'Some error occurred while retrieving records.',
            });
          });
      } else {
        Interested.create({ ShipmentId: ShipmentId, UserId: UserId, IsInterested: true, InterestDate: new Date() })
          .then((data) => {
            res.status(200).send({
              message: 'Shown Interest',
              data: data,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: `${err.message} -Bad Operation` || 'Some error occurred while retrieving records.',
            });
          });
      }
    })
    .catch((err) => {
      console.log(`error`, err.message);
      res.status(500).send({
        message: `${err.message} -Bad Operation` || 'Some error occurred while retrieving records.',
      });
    });
};

exports.findAllShipmentsInterest = (req, res) => {
  // const status = req.params.shipmentStatus;
  // const shipmentId = req.params.shipmentId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true },

    include: {
      model: User,
      attributes: ['FullName'],
    },

    include: {
      model: Shipment,
      attributes: ['LoadCategory', 'LoadType', 'LoadWeight', 'LoadUnit', 'Qty', 'Description'],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsInterestByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Interested.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },

    include: {
      model: User,
      attributes: ['FullName'],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

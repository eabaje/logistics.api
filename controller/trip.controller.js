const db = require('../models/index.model');
const Trip = db.trip;
const Track = db.track;
const Op = db.Sequelize.Op;

// Create and Save a new Trip
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Trip
  const trip = {
    TrackId: req.body.TrackId,
    VehicleId: req.body.VehicleId,
    DriverId: req.body.DriverId,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryLocation: req.body.DeliveryLocation,
    PickUpDate: req.body.PickUpDate,
    DeliveryDate: req.body.DeliveryDate,
    DriverNote: req.body.DriverNote,
    ShipmentId: req.body.ShipmentId,
  };

  // Save Trip in the database
  Trip.create(trip)

    .then((data) => {
      res.status(200).send({
        message: 'Trip was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Trip.',
      });
    });
};

// Retrieve all Trips start the database.
exports.findAll = (req, res) => {
  const trackId = req.query.trackId;
  var condition = trackId ? { trackId: { [Op.iLike]: `%${trackId}%` } } : null;

  Trip.findAll({ where: condition })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Trips.',
      });
    });
};

// Find a single Trip with an id
exports.findOne = (req, res) => {
  const id = req.params.tripId;

  Trip.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Trip with TripId=' + id,
      });
    });
};

// Update a Trip by the id in the request
exports.update = (req, res) => {
  const id = req.params.tripId;

  Trip.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Trip was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Trip with id=${id}. Maybe Trip was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Trip with id=' + id,
      });
    });
};

// Delete a Trip with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.tripId;

  Trip.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Trip was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Trip with id=${id}. Maybe Trip was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Trip with id=' + id,
      });
    });
};

// Delete all Trips start the database.
exports.deleteAll = (req, res) => {
  Trip.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Trips were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Trips.',
      });
    });
};

// Find a single Trip with an id
exports.findTripByShipment = (req, res) => {
  const id = req.params.driverId;

  Trip.findOne({ where: { ShipmentId: id } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Trip with TripId=' + id,
      });
    });
};

// find all  Trip By PickUpLocation
exports.findAllTripsByPickUpLocation = (req, res) => {
  const pickUpLocation = req.params.pickUpLocation;
  Trip.findAll({ where: { PickUpLocation: pickUpLocation } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Trips.',
      });
    });
};

// find all  Trip By DeliveryLocation
exports.findAllTripsByDeliveryLocation = (req, res) => {
  const deliveryLocation = req.params.deliveryLocation;
  Trip.findAll({ where: { DeliveryLocation: deliveryLocation } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Trips.',
      });
    });
};

exports.findAllTripsByVehicle = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const vehicleId = req.params.vehicleId;

  Trip.findAll({
    where: {
      [Op.and]: [
        { VehicleId: vehicleId },
        {
          createdAt: {
            [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
          },
        },
      ],
    },
    order: [['createdAt', 'ASC']],
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Trips.',
    });
  });
};

exports.findAllTripsByDriver = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const driverId = req.params.driverId;

  Trip.findAll({
    where: {
      [Op.and]: [
        { DriverId: driverId },
        {
          createdAt: {
            [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
          },
        },
      ],
    },
    order: [['createdAt', 'ASC']],
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Trips.',
    });
  });
};

// find all  Trip by PickUpDate
exports.findAllTripsByPickUpDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Trip.findAll({
    where: {
      PickUpDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    order: [['createdAt', 'ASC']],
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Trips.',
    });
  });
};

// find all  Trip by DeliveryDate
exports.findAllTripsByDeliveryDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Trip.findAll({
    where: {
      DeliveryDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    order: [['createdAt', 'ASC']],
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Trips.',
    });
  });
};

// find all  Trip by date
exports.findAllTripsByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Trip.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    order: [['createdAt', 'ASC']],
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Trips.',
    });
  });
};

exports.addTrack = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Trip
  const track = {
    TrackId: req.body.TrackId,
    TripId: req.body.TripId,
    Status: req.body.Status,
    TrackNote: req.body.TrackNote,
  };

  // Save Trip in the database
  Track.create(track)

    .then((data) => {
      res.status(200).send({
        message: 'Track was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Trip.',
      });
    });
};

// Retrieve all Trips start the database.
exports.findAllTrack = (req, res) => {
  const tripId = req.query.tripId;
  var condition = tripId ? { TripId: tripId } : null;

  Track.findAll({
    where: condition,

    include: {
      model: Trip,
      attributes: ['DeliveryDate', 'PickUpDate', 'PickUpLocation', 'DeliveryLocation'],
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
        message: err.message || 'Some error occurred while retrieving Trips.',
      });
    });
};

// Find a single Trip with an id
exports.findOneTrack = (req, res) => {
  const id = req.params.trackId;

  Track.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Track with TrackId=' + id,
      });
    });
};

// Update a Trip by the id in the request
exports.updateTrack = (req, res) => {
  const id = req.params.trackId;

  Track.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Track was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Track with TrackId=${id}. Maybe Track was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Trip with TrackId=' + id,
      });
    });
};

// Delete a Trip with the specified id in the request
exports.deleteTrack = (req, res) => {
  const id = req.params.tripId;

  Track.destroy({
    where: { TrackId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Track was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Track with TrackId=${id}. Maybe Track was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Track with TrackId=' + id,
      });
    });
};

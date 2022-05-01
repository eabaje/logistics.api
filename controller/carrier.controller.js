const db = require('../models/index.model');
const Carrier = db.carrier;
const Company = db.company;
const Op = db.Sequelize.Op;

// Create and Save a new Carrier
exports.create = (req, res) => {
  // Validate request

  // Create a Carrier
  const carrier = {
    CarrierType: req.body.CarrierType,
    FleetType: req.body.FleetType,
    FleetNumber: req.body.FleetNumber,
    AboutUs: req.body.AboutUs,
    ServiceDescription: req.body.ServiceDescription,
    Rating: req.body.Rating,
    Licensed: req.body.Licensed ? req.body.Licensed : false,
    CompanyId: req.body.CompanyId,
    // CarrierDocs: req.body.CarrierDocs
  };

  // Save Carrier in the database
  Carrier.create(carrier)

    .then((data) => {
      res.status(200).send({
        message: 'Carrier information added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`error`, err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Carrier.',
      });
    });
};

// Retrieve all Carriers from the database.
exports.findAll = (req, res) => {
  const carrierType = req.params.carrierType;
  var condition = carrierType ? { CarrierType: { [Op.iLike]: `%${carrierType}%` } } : null;

  // Carrier.findAll({ where: condition })

  Carrier.findAll({
    // where: {
    //   condition
    // },
    // attributes: {
    //     exclude: ['createdAt', 'updatedAt']   DairyId: req.query.dairyid
    // },
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
        message: err.message || 'Some error occurred while retrieving Carriers.',
      });
    });
};

// sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
//   .then(function(users) {
//     // We don't need spread here, since only the results will be returned for select queries
//   })

// Find a single Carrier with an id
exports.findOne = (req, res) => {
  const id = req.params.carrierId;

  Carrier.findOne({
    where: {
      CarrierId: id,
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
      console.log(`err`, err);
      res.status(500).send({
        message: 'Error retrieving Carrier with CarrierId=' + id,
      });
    });
};

exports.findAllCarriersByCompany = (req, res) => {
  
  const id = req.params.companyId;

  Carrier.findAll({
    where: { CompanyId: id },

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
        message: err.message || 'Some error occurred while retrieving Carriers.',
      });
    });
};
// Update a Carrier by the id in the request
exports.update = (req, res) => {
  const id = req.params.carrierId;

  Carrier.update(req.body, {
    where: { CarrierId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Carrier was updated successfully.',
        });
      } else {
        res.status(200).send({
          message: `Cannot update Carrier with id=${id}. Maybe Carrier was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Carrier with id=' + id,
      });
    });
};

// Delete a Carrier with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.carrierId;

  Carrier.destroy({
    where: { CarrierId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Carrier was deleted successfully!',
        });
      } else {
        res.status(200).send({
          message: `Cannot delete Carrier with id=${id}. Maybe Carrier was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Carrier with id=' + id,
      });
    });
};

// Delete all Carriers from the database.
exports.deleteAll = (req, res) => {
  Carrier.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.status(200).send({ message: `${nums} Carriers were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Carriers.',
      });
    });
};

// find all insured Carrier
exports.findAllCarriersLicensed = (req, res) => {
  Carrier.findAll({
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
        message: err.message || 'Some error occurred while retrieving Carriers.',
      });
    });
};

// find all  Carrier by date
exports.findAllCarriersByDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

  Carrier.findAll({
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
        message: err.message || 'Some error occurred while retrieving Carriers.',
      });
    });
};

const db = require('../models/index.model');
const { mailFunc } = require('../middleware');
const Shipment = db.shipment;
const ShipmentDetail = db.shipmentdetail;
const User = db.user;
const Driver = db.driver;
const Company = db.company;
const Interested = db.interested;
const AssignDriverShipment = db.assigndrivershipment;
const AssignShipment = db.assignshipment;
//AssignDriverShipment

const Op = db.Sequelize.Op;

// Create and Save a new Shipment
exports.create = async (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  try {
    // Create a Shipment
    const shipment = {
      CompanyId: req.body.CompanyId,
      UserId: req.body.UserId,
      LoadCategory: req.body.LoadCategory,
      LoadType: req.body.LoadType,
      LoadWeight: req.body.LoadWeight ? req.body.LoadWeight : 0,
      LoadUnit: req.body.LoadUnit,
      Qty: req.body.Qty ? req.body.Qty : 0,
      Description: req.body.Description,
      PickUpLocation: req.body.PickUpLocation,
      DeliveryLocation: req.body.DeliveryLocation,
      PickUpCountry: req.body.PickUpCountry,
      PickUpRegion: req.body.PickUpRegion,
      PickUpCity: req.body.PickUpCity,

      PickUpLocation: req.body.PickUpLocation,
      DeliveryCountry: req.body.DeliveryCountry,
      DeliveryRegion: req.body.DeliveryRegion,
      DeliveryCity: req.body.DeliveryCity,

      DeliveryLocation: req.body.DeliveryLocation,

      ExpectedPickUpDate: req.body.ExpectedPickUpDate,
      ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,

      RequestForShipment: req.body.RequestForShipment,
      ShipmentRequestPrice: req.body.ShipmentRequestPrice,

      DeliveryContactName: req.body.DeliveryContactName,
      DeliveryContactPhone: req.body.DeliveryContactPhone,

      DeliveryEmail: req.body.DeliveryEmail,
      AssignedShipment: req.body.AssignedShipment,

      ShipmentRequestPrice: req.body.ShipmentRequestPrice,

      ShipmentDate: req.body.ShipmentDate,
      ShipmentDocs: req.body.ShipmentDocs,
      ShipmentStatus: req.body.ShipmentStatus,
    };
    console.log('request.body', req.body);
    // Save Shipment in the database

    const newShipment = await Shipment.create(shipment);

    if (newShipment) {
      const shipmentDetailArrayLength = req.body.vehicle.length;

      if (shipmentDetailArrayLength <= 0) {
      }

      await req.body.vehicle.map((vehicle, index) => {
        const shipmentDetail = {
          ShipmentId: newShipment.ShipmentId,
          VehicleType: vehicle.VehicleType,
          VIN: vehicle.VIN,
          VehicleMake: vehicle.VehicleMake,
          VehicleColor: vehicle.VehicleColor,
          VehicleModel: vehicle.VehicleModel,

          VehicleModelYear: vehicle.VehicleModelYear,
          // PurchaseYear: vehicle.VehicleType,
        };

        const newShipmentDetails = ShipmentDetail.create(shipmentDetail);
      });

      return res.status(200).send({
        message: 'Shipment was added successfully',
        data: newShipment,
      });
    }
  } catch (error) {
    console.log('error:', error.message);
    return res.status(500).send({
      message: error.message || 'Some error occurred while creating the Shipment.',
    });
  }
  // Shipment.create(shipment)
  //   .then((data) => {
  //     res.status(200).send({
  //       message: 'Shipment was added successfully',
  //       data: data,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log('error:', err.message);
  //     res.status(500).send({
  //       message: err.message || 'Some error occurred while creating the Shipment.',
  //     });
  //   });
};

// Retrieve all Shipments start the database.
exports.findAll = (req, res) => {
  const loadCategory = req.params.loadCategory;
  var condition = loadCategory ? { LoadCategory: { [Op.iLike]: `%${loadCategory}%` } } : null;

  Shipment.findAll({
    where: condition,

    include: [
      {
        model: ShipmentDetail,
      },
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: User,
        attributes: ['FullName', 'Email', 'Phone'],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

// Find a single Shipment with an id
exports.findOne = (req, res) => {
  const id = req.params.shipmentId;

  Shipment.findOne({
    where: { ShipmentId: id },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
        attributes: ['CompanyName'],
      },

      {
        model: ShipmentDetail,
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

  Shipment.findAll({
    where: {
      condition,
    },
    include: [
      {
        model: ShipmentDetail,
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsAssigned = (req, res) => {
  const status = req.params.shipmentStatus;
  const assignedshipment = req.params.assignedshipment;
  const shipmentId = req.params.shipmentId;
  var condition = shipmentId
    ? { [Op.and]: [{ ShipmentId: shipmentId }, { AssignedShipment: assignedshipment }] }
    : { ShipmentStatus: status };

  // Shipment.findAll({ where: condition },
  Shipment.findAll({
    where: {
      condition,
    },
    include: [
      {
        model: ShipmentDetail,
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
    include: [
      {
        model: ShipmentDetail,
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
    include: [
      {
        model: ShipmentDetail,
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
    include: [
      {
        model: ShipmentDetail,
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
    PickUpCity: req.body.PickUpCity,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryCountry: req.body.DeliveryCountry,
    DeliveryRegion: req.body.DeliveryRegion,
    DeliveryCity: req.body.DeliveryCity,
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

exports.showInterest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    const InterestedResult = await Interested.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, UserId: UserId },
    });

    if (InterestedResult === null) {
      // create new interest
      const newRecord = await Interested.create({
        ShipmentId: ShipmentId,
        UserId: UserId,
        CompanyId: CompanyId,
        IsInterested: true,
        InterestDate: new Date(),
      });

      const interestedUser = await User.findOne({ where: { UserId: req.body.UserId } });

      const shipmentUser = await Shipment.findOne({
        where: { ShipmentId: req.body.ShipmentId },
        include: [
          {
            model: User,
            attributes: ['FullName', 'Email'],
          },
        ],
      });

      const url = process.env.ADMIN_URL + `/company/review-company-action/?companyId=${CompanyId}&readOnly=true`;

      //Send mail to Shipment Owner
      const msgShipment = `You have an interest from  ${interestedUser.FullName} for Load Boarding Services.Kindly check the profile  <a href='${url}'>here</a>  `;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'Request for LoadBoarding Services',
        toEmail: shipmentUser.User.Email,
        msg: {
          name: shipmentUser.User.FullName,
          msg: msgShipment,
          // url: url,
        },
      });

      //Send Mail to interested carrier
      const msgCarrier = `Your interest in shipment with ref:${req.body.ShipmentId} for Load Boarding Services has been sent.We wish you best luck going further in the process.`;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'Request for LoadBoarding Services',
        toEmail: interestedUser.Email,
        msg: {
          name: interestedUser.FullName,
          msg: msgCarrier,
          // url: url,
        },
      });

      res.status(200).send({
        message: 'Shown Interest',
        data: newRecord,
      });
    } else {
      const IsInterestedResult = await Interested.findOne({
        where: { ShipmentId: ShipmentId, CompanyId: CompanyId, UserId: UserId, IsInterested: false },
      });

      if (IsInterestedResult) {
        const updatedInterestTrue = await Interested.update(
          { IsInterested: true },
          { where: { ShipmentId: ShipmentId, UserId: UserId, CompanyId: CompanyId } },
        );

        res.status(200).send({
          message: 'Restored Interest',
          data: updatedInterestTrue,
        });
      } else {
        const updatedInterestFalse = await Interested.update(
          { IsInterested: false },
          { where: { ShipmentId: ShipmentId, UserId: UserId, CompanyId: CompanyId } },
        );
        res.status(200).send({
          message: 'Withdrawn Interest',
          data: updatedInterestFalse,
        });
      }
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignCompanyShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { ShipmentId: ShipmentId },
    });
    if (IsAssignedShipment) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedShipment.CompanyId } });
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has been officially assigned to ${company.CompanyName}`,
      });
    }

    const newAssignment = await AssignShipment.create({
      ShipmentId: ShipmentId,
      CompanyId: CompanyId,
      UserId: UserId,
      AssignedTo: CompanyId,
      IsAssigned: true,
      AssignedDate: new Date(),
    });

    const updateShipment = await Shipment.update(
      {
        AssignedShipment: true,
        AssignedCarrier: CompanyId,
      },

      { where: { ShipmentId: ShipmentId } },
    );

    const user = await User.findOne({ where: { UserId: req.body.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId } });

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgShipment = `You have an assigned Shipment with Ref No  ${ShipmentId} for Load Boarding Services to Company ${company.CompanyName}.Kindly check the details  <a href=${url}>here</a>  `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        // url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = `Congratulations! You have been assigned shipment with ref:${ShipmentId} for Load Boarding Services .Kindly check the details  <a href='${url}'>here</a> `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Shipment Assignemnt for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        // url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been assigned to Company ${companyUser.CompanyName} `,
      data: newRecord,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignDriverShipment = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const DriverId = req.body.DriverId;
  const ShipmentId = req.body.ShipmentId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if shipment was assigned to company

    const IsAssignedShipment = await AssignShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId },
    });
    if (IsAssignedShipment === null) {
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has not been officially assigned`,
      });
    }
    const IsAssignedDriverShipment = await AssignDriverShipment.findOne({
      where: { CompanyId: CompanyId, ShipmentId: ShipmentId, DriverId: DriverId },
    });

    if (IsAssignedDriverShipment) {
      res.status(200).send({
        message: `Shipment with ref ${ShipmentId} has been assigned already`,
      });
    }

    const newRecord = await AssignDriverShipment.create({
      ShipmentId: ShipmentId,
      CompanyId: CompanyId,
      UserId: UserId,
      DriverId: DriverId,
      IsAssigned: true,
      AssignedDate: new Date(),
      AssignedToDriver: DriverId,
    });

    const user = await User.findOne({ where: { UserId: req.body.UserId } });

    const driver = await Driver.findOne({ where: { DriverId: req.body.DriverId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const url = process.env.ADMIN_URL + `/shipment/assign-shipment/?shipmentId=${ShipmentId}&driverId=${DriverId}`;

    //Send mail to Carrier
    const msgShipment = `You have an assigned Shipment with Ref No  ${ShipmentId} for Load Boarding Services to driver ${driver.DriverName}.Kindly check the details  <a href=${url}>here</a>  `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgShipment,
        // url: url,
      },
    });

    //Send Mail to Driver assigned shipment
    const msgCarrier = `Congratulations! You have been assigned shipment with ref:${ShipmentId} for Load Boarding Services .Kindly check the details  <a href='${url}'>here</a> `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Shipment Assignemnt for LoadBoarding Services',
      toEmail: driver.Email,
      msg: {
        name: driver.DriverName,
        msg: msgCarrier,
        // url: url,
      },
    });

    res.status(200).send({
      message: `Shipment with Ref ${ShipmentId} has been assigned to Driver ${driver.DriverName} `,
      data: newRecord,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.findAllShipmentsInterest = (req, res) => {
  // const status = req.params.shipmentStatus;
  // const shipmentId = req.params.shipmentId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Shipment,
      },
      {
        model: ShipmentDetail,
        attributes: [
          'VehicleType',
          'VIN',
          'VehicleMake',
          'VehicleColor',
          'Qty',
          'VehicleModel',
          'VehicleModelYear',
          'PurchaseYear',
        ],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

exports.findAllShipmentsInterestByShipmentId = (req, res) => {
  // const status = req.params.shipmentStatus;
  const shipmentId = req.params.shipmentId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true, ShipmentId: shipmentId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Shipment,
      },
      {
        model: ShipmentDetail,
        attributes: [
          'VehicleType',
          'VIN',
          'VehicleMake',
          'VehicleColor',
          'Qty',
          'VehicleModel',
          'VehicleModelYear',
          'PurchaseYear',
        ],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};
exports.findAllShipmentsInterestByCompany = (req, res) => {
  // const status = req.params.shipmentStatus;
  const companyId = req.params.companyId;
  // var condition = shipmentId
  //   ? { [Op.and]: [{ ShipmentId: shipmentId }, { ShipmentStatus: status }] }
  //   : { ShipmentStatus: status };

  Interested.findAll({
    where: { IsInterested: true, CompanyId: companyId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Shipment,
      },
      {
        model: ShipmentDetail,
        attributes: [
          'VehicleType',
          'VIN',
          'VehicleMake',
          'VehicleColor',
          'Qty',
          'VehicleModel',
          'VehicleModelYear',
          'PurchaseYear',
        ],
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

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: ShipmentDetail,
        attributes: [
          'VehicleType',
          'VIN',
          'VehicleMake',
          'VehicleColor',
          'Qty',
          'VehicleModel',
          'VehicleModelYear',
          'PurchaseYear',
        ],
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
        message: err.message || 'Some error occurred while retrieving Shipments.',
      });
    });
};

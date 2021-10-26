const db = require('../models/index.model');
const Order = db.order;
const Op = db.Sequelize.Op;

// Create and Save a new Order
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  // Create a Order
  const order = {
    UserId: req.body.UserId,
    OrderId: req.body.OrderId,
    TotalPrice: req.body.TotalPrice,
    OrderSessionId: req.body.OrderSessionId,
    ReferenceId: req.body.ReferenceId,
    OrderStatus: req.body.OrderStatus,
    // Licensed: req.body.Licensed ? req.body.Licensed : false,
    OrderMethod: req.body.OrderMethod,
    // OrderDocs: req.body.OrderDocs
  };

  // Save Order in the database
  Order.create(order)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Order.',
      });
    });
};

// Retrieve all Orders from the database.
exports.findAll = (req, res) => {
  const orderType = req.query.OrderType;
  var condition = OrderType ? { OrderType: { [Op.iLike]: `%${orderType}%` } } : null;

  Order.findAll({ where: condition })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Orders.',
      });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
  const id = req.params.orderId;

  Order.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Order with OrderId=' + id,
      });
    });
};

// Update a Order by the id in the request
exports.update = (req, res) => {
  const id = req.params.orderId;

  Order.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Order was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Order with id=' + id,
      });
    });
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.orderId;

  Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Order was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Order with id=' + id,
      });
    });
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Orders were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Orders.',
      });
    });
};

// find all insured Order
exports.findAllOrdersLicensed = (req, res) => {
  Order.findAll({ where: { Licensed: true } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Orders.',
      });
    });
};

// find all  Order by date
exports.findAllOrdersByDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

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
        message: err.message || 'Some error occurred while retrieving Orders.',
      });
    });
};

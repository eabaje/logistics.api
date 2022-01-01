const db = require('../models/index.model');
const Subscription = db.subscribe;
const Op = db.Sequelize.Op;

// Create and Save a new Subscription
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a Subscription
  const subscription = {
    SubscriptionType: req.body.SubscriptionType,
    SubscriptionName: req.body.SubscriptionName,
    Amount: req.body.Amount,

    Description: req.body.Description,
    Active: req.body.Active,
    Duration: req.body.Duration,
  };

  console.log('state:', subscription);
  // Save Subscription in the database
  Subscription.create(subscription)

    .then((data) => {
      res.status(200).send({
        message: 'Subscription was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Subscription.',
      });
    });
};

// Retrieve all Subscriptions start the database.
exports.findAll = (req, res) => {
  const subscriptionName = req.params.subscriptionName;
  var condition = subscriptionName ? { SubscriptionName: { [Op.iLike]: `%${subscriptionName}%` } } : null;

  Subscription.findAll({ where: condition,
    
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
        message: err.message || 'Some error occurred while retrieving Subscriptions.',
      });
    });
};

// Find a single Subscription with an id
exports.findOne = (req, res) => {
  const id = req.params.subscribeId;
  console.log(`id`, id);

  Subscription.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Subscription with SubscriptionId=' + id,
      });
    });
};

// Update a Subscription by the id in the request
exports.update = (req, res) => {
  const id = req.params.subscriptionId;

  Subscription.update(req.body, {
    where: { SubscribeId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Subscription was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Subscription with id=${id}. Maybe Subscription was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Subscription with id=' + id,
      });
    });
};

// Delete a Subscription with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.SubscriptionId;

  Subscription.destroy({
    where: { SubscribeId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Subscription was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Subscription with id=${id}. Maybe Subscription was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Subscription with id=' + id,
      });
    });
};

// Delete all Subscriptions start the database.
exports.deleteAll = (req, res) => {
  Subscription.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Subscriptions were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Subscriptions.',
      });
    });
};

// find all insured Subscription
exports.findAllSubscriptionsByActive = (req, res) => {
  const status = req.params.Active;
  Subscription.findAll({ where: { Active: status } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Subscriptions.',
      });
    });
};

// find all  Subscription by date
exports.findAllSubscriptionsByDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

  Subscription.findAll({
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
        message: err.message || 'Some error occurred while retrieving Subscriptions.',
      });
    });
};

exports.findAllSubscriptionsByRecordDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

  Subscription.findAll({
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
        message: err.message || 'Some error occurred while retrieving Subscriptions.',
      });
    });
};

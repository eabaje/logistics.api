require('dotenv').config();
const db = require('../models/index.model');
const Payment = db.payment;
const Op = db.Sequelize.Op;
const stripe = require('stripe')(process.env.STRIPE_KEY);

// Create and Save a new Payment
exports.create = (req, res) => {
  // Create a Payment
  const payment = {
    UserId: req.body.UserId,
    OrderId: req.body.OrderId,
    TotalPrice: req.body.TotalPrice,
    PaymentSessionId: req.body.PaymentSessionId,
    ReferenceId: req.body.ReferenceId,
    OrderStatus: req.body.OrderStatus,
    // Licensed: req.body.Licensed ? req.body.Licensed : false,
    PaymentMethod: req.body.PaymentMethod,
    PaymentDate: req.body.PaymentDate,
  };

  // Save Payment in the database
  Payment.create(payment)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log('err', err);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Payment.',
      });
    });
};

exports.StripecheckoutFirst = async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.json({ id: session.id });
};

// exports.stripecheckoutSecond = (req, res) => {
//   // Moreover you can take more details start user
//   // like Address, Name, etc start form
//   stripe.customers
//     .create({
//       email: req.body.stripeEmail,
//       source: req.body.stripeToken,
//       name: req.body.,
//       address: {
//         line1: 'TC 9/4 Old MES colony',
//         postal_code: '110092',
//         city: 'New Delhi',
//         state: 'Delhi',
//         country: 'India',
//       },
//     })
//     .then((customer) => {
//       return stripe.charges.create({
//         amount: req.body.amount * 100, // Charing Rs 25
//         description: req.body.ProductType,
//         currency: 'USD',
//         customer: customer.id,
//       });
//     })
//     .then((charge) => {
//       res.send('Success'); // If no error occurs
//     })
//     .catch((err) => {
//       res.send(err); // If some error occurs
//     });
// };

// // Retrieve all Payments start the database.
// exports.findAll = (req, res) => {
//   const paymentType = req.query.PaymentType;
//   var condition = PaymentType ? { PaymentType: { [Op.iLike]: `%${paymentType}%` } } : null;

//   Payment.findAll({ where: condition })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while retrieving Payments.',
//       });
//     });
// };

// Find a single Payment with an id
exports.findOne = (req, res) => {
  const id = req.params.paymentId;

  Payment.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Payment with PaymentId=' + id,
      });
    });
};

// Update a Payment by the id in the request
exports.update = (req, res) => {
  const id = req.params.paymentId;

  Payment.update(req.body, {
    where: { PaymentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Payment was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Payment with id=${id}. Maybe Payment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Payment with id=' + id,
      });
    });
};

// Delete a Payment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.paymentId;

  Payment.destroy({
    where: { PaymentId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Payment was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Payment with id=${id}. Maybe Payment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Payment with id=' + id,
      });
    });
};

// Delete all Payments start the database.
exports.deleteAll = (req, res) => {
  Payment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Payments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Payments.',
      });
    });
};

// find all  Payment by date
exports.findAllPaymentsByDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

  Payment.findAll({
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
        message: err.message || 'Some error occurred while retrieving Payments.',
      });
    });
};

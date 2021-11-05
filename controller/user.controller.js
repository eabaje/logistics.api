require('dotenv').config();
const path = require('path');
var fs = require('fs');
require('../config/nodemailer.config');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index.model');

const User = db.user;
const UserSubscription = db.usersubscription;
const Company = db.company;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a User

  const user = {
    FullName: req.body.FullName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Address: req.body.Address,
    City: req.body.City,
    Country: req.body.Country,
    UserPicUrl: req.body.UserPicUrl,
    Password: '',
    // UserDocs: req.body.UserDocs
  };
  // Save User in the database

  //exports.createUser = (req, res) => {
  const email = req.body.Email;

  const oldUser = User.findAll({ where: { Email: email } });

  if (oldUser) {
    return res.status(409).send('User Already Exist. Please Login');
  }
  //Encrypt user password
  user.Password = bcrypt.hash(password, 10);
  const newUser = User.create(user);

  // .then(data => {
  //   res.send(data);
  // })
  // .catch(err => {
  //         res.status(500).send({
  //             message:
  //             err.message || "Some error occurred while creating the User."
  //         });
  //    });

  const token = jwt.sign({ userid: User.UserId, email }, process.env.TOKEN_KEY, {
    expiresIn: '2h',
  });
  // save user token
  user.token = token;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Step 2 - Generate a verification token with the user's ID
  const verificationToken = user.generateVerificationToken();
  // Step 3 - Email the user a unique verification link
  const url = process.env.BASE_URL + '/verify/${token}';
  transporter.sendMail({
    to: email,
    subject: 'Verify Account',
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  });
  return res.status(201).send({
    message: `Sent a verification email to ${email}`,
  });

  // };
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  // const name = req.params.name;
  //var condition = name ? { FullName: { [Op.iLike]: `%${name}%` } } : null;{ where: condition }

  User.findAll()
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllBySearch = (req, res) => {
  const name = req.params.name;
  var condition = name ? { FullName: { [Op.iLike]: `%${name}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.UserId;

  User.findByPk(id)
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving User with UserId=' + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const user = ({ UserId, FullName, Email, Phone, Address, City, Country, UserPicUrl } = req.body);
  const id = req.body.UserId;

  const imagePath = req.file.filename;

  // await fs.unlink(path.resolve('src/uploads/Profile/' + imagedb[0].image));

  User.update(user, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating User with id=' + id,
      });
    });
};

exports.changeImageProfile = async (req, res = response) => {
  try {
    const imagePath = req.file.filename;

    const imagedb = await pool.query('SELECT image FROM person WHERE uid = ?', [req.uid]);

    await fs.unlink(path.resolve('src/Uploads/Profile/' + imagedb[0].image));

    await pool.query('UPDATE person SET image = ? WHERE uid = ?', [imagePath, req.uid]);

    res.json({
      resp: true,
      msg: 'Picture changed',
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.UserId;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Users.',
      });
    });
};

// find all  User by date
exports.findAllUsersByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  User.findAll({
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.createCompany = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  // Create a Order
  const company = {
    CompanyName: req.body.CompanyName,
    ContactEmail: req.body.ContactEmail,
    ContactPhone: req.body.ContactPhone,
    Address: req.body.Address,
    Country: req.body.Country,
    CompanyType: req.body.CompanyType,
  };

  // Save Order in the database
  Company.create(company)

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

exports.updateCompany = (req, res) => {
  const id = req.body.CompanyId;

  Company.update(req.body, {
    where: { CompanyId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Company was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Company with id=${id}. Maybe Company was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Company with id=' + id,
      });
    });
};

exports.findCompany = (req, res) => {
  const id = req.params.CompanyId;

  Company.findByPk(id)

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Company with CompanyId=' + id,
      });
    });
};

exports.findAllCompanys = (req, res) => {
  const CompanyType = req.query.CompanyType;
  var condition = CompanyType ? { CompanyType: { [Op.iLike]: `%${CompanyType}%` } } : null;

  Company.findAll({ where: condition })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllCompanysByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Company.findAll({
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.deleteCompany = (req, res) => {
  const id = req.params.CompanyId;

  Company.destroy({
    where: { CompanyId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Company was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Company with id=${id}. Maybe Company was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Company with id=' + id,
      });
    });
};

exports.subscribe = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Add user to Subscription

  const subscribe = {
    SubscriptionId: req.body.SubscriptionId,
    SubscriptionName: req.body.SubscriptionName,
    UserId: req.body.UserId,
    Active: req.body.Active,
    StartDate: req.body.StartDate,
    EndDate: req.body.EndDate,
  };

  const UserId = req.body.UserId;

  const IsSubscribed = UserSubscription.findAll({ where: { UserId: UserId } && { Active: true } });

  if (IsSubscribed) {
    return res.status(409).send('User Already Subscribed. Do you want to upgrade your subscription?');
  }

  const UserSubscribed = UserSubscription.create(subscribe);

  const User = User.findOne({ where: { UserId: UserId } });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.sendMail({
    to: email,
    subject: 'Tnanks for your subscription',
    html: `Dear ${User.FullName}<p> You subscribed to package ${SubscriptionName} from ${StartDate} to ${EndDate}</p>kindly Click <a href = '${url}'>here</a> to your dashboard to begin.`,
  });
  return res.status(201).send({
    message: `Sent a verification email to ${email}`,
  });

  // };
};

exports.upgradeUserSubscription = (req, res) => {
  const subscribe = {
    SubscriptionId: req.body.SubscriptionId,
    SubscriptionName: req.body.SubscriptionName,
    UserId: req.body.UserId,
    Active: req.body.Active,
    StartDate: req.body.StartDate,
    EndDate: req.body.EndDate,
  };

  const id = req.body.UserSubscriptionId;

  const UserId = req.body.UserId;

  const IsSubscribed = UserSubscription.findAll({ where: { UserId: UserId } && { Active: true } });

  if (IsSubscribed) {
    UserSubscription.update(
      { Active: false },
      {
        where: {
          UserId: UserId,
        },
      },
    );

    const UserSubscribed = UserSubscription.create(subscribe);

    if (UserSubscribed) {
      return res.status(201).send({ message: `User Subscribed to  ${UserSubscribed.SubscriptionName} package.` });
    }
  }
};

exports.updateUserSubscription = (req, res) => {
  const id = req.body.UserSubscriptionId;

  UserSubscription.update(req.body, {
    where: { UserSubscriptionId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User Subscription with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating User Subscription with id=' + id,
      });
    });
};

exports.findUserSubscription = (req, res) => {
  const id = req.params.UserId;

  UserSubscription.findOne({ where: { UserId: id } })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving User with UserId=' + id,
      });
    });
};

exports.findAllUserSubscriptions = (req, res) => {
  const SubscriptionType = req.query.SubscriptionType;
  var condition = SubscriptionType ? { SubscriptionType: { [Op.iLike]: `%${SubscriptionType}%` } } : null;

  UserSubscription.findAll({ where: condition })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllUserSubscriptionsByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  User.UserSubscription({
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllUserSubscriptionsByStartDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  User.UserSubscription({
    where: {
      StartDate: {
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllUserSubscriptionsByEndDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  User.UserSubscription({
    where: {
      EndDate: {
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.deleteUserSubscription = (req, res) => {
  const id = req.params.UserId;

  UserSubscription.destroy({
    where: { UserSubscriptionId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id,
      });
    });
};

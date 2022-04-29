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
const Subscription = db.subscribe;
const Company = db.company;
const Role = db.role;
const UserRole = db.userrole;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  User.findOne({
    where: {
      Email: req.body.Email,
    },
  }).then((user) => {
    if (user) {
      return res.status(404).send({ message: 'Email already exists' });
    }
  });

  Company.create({
    CompanyName: req.body.CompanyName,
    ContactEmail: req.body.ContactEmail,
    ContactPhone: req.body.ContactPhone,
    Address: req.body.CompanyAddress,
    Region: req.body.Region,
    Country: req.body.Country,
    CompanyType: req.body.RoleType,
    Specilaization: req.body.Specilaization,
  })
    .then((company) => {
      //const company = Company.save();
      const encryptedPassword = req.body.Password
        ? bcrypt.hashSync(req.body.Password, 10)
        : bcrypt.hashSync(generator.generate({ length: 8, numbers: true }), 10);

      //console.log('Password:', encryptedPassword);
      const email = req.body.ContactEmail ? req.body.ContactEmail : req.body.Email;
      const fullname = req.body.FullName ? req.body.FullName : req.body.FirstName + ' ' + req.body.LastName;

      User.create({
        CompanyId: company.CompanyId,
        FullName: req.body.FullName ? req.body.FullName : req.body.FirstName + ' ' + req.body.LastName,
        Email: req.body.Email.toLowerCase(),
        Phone: req.body.Phone,
        Address: req.body.Address,
        City: req.body.Region,
        Country: req.body.Country,
        UserName: req.body.Email.toLowerCase(),
        AcceptTerms: req.body.AcceptTerms,
        PaymentMethod: req.body.PaymentMethod,
        Password: encryptedPassword,
      })
        .then((user) => {
          console.log(`RoleType`, req.body.RoleType);
          if (req.body.RoleType) {
            Role.findOne({
              where: {
                Name: req.body.RoleType,
              },
            }).then((role) => {
              UserRole.create({ UserId: user.UserId, RoleId: role.RoleId });

              // Add User Subscription
              // user.setRoles(roles).then(() => {
              const token = jwt.sign({ UserId: user.UserId }, `${process.env.TOKEN_KEY}`, {
                expiresIn: '2h',
              });
              // save user token
              user.Token = token;
              user.save();

              const transporter = nodemailer.createTransport({
                service: `${process.env.MAIL_SERVICE}`,
                auth: {
                  user: `${process.env.EMAIL_USERNAME}`,
                  pass: `${process.env.EMAIL_PASSWORD}`,
                },
              });
              // //  mailgun
              // // Step 2 - Generate a verification token with the user's ID
              // const verificationToken = user.generateVerificationToken();
              // // Step 3 - Email the user a unique verification link

              // point to the template folder
              const handlebarOptions = {
                viewEngine: {
                  partialsDir: path.resolve('./views/'),
                  defaultLayout: false,
                },
                viewPath: path.resolve('./views/'),
              };

              // use a template file with nodemailer
              transporter.use('compile', hbs(handlebarOptions));

              const url = `${process.env.BASE_URL}` + `auth/verify/${token}`;
              transporter
                .sendMail({
                  from: `${process.env.FROM_EMAIL}`,
                  to: email,
                  template: 'email2', // the name of the template file i.e email.handlebars
                  context: {
                    name: fullname,
                    url: url,
                  },
                  subject: 'Welcome to Global Load Dispatch',
                  //     html: `<h1>Email Confirmation</h1>
                  // <h2>Hello ${fullname}</h2>

                  // <p>By signing up for a free 90 day trial with Load Dispatch Service, you can connect with carriers,shippers and drivers.<br/></p>
                  // To finish up the process kindly click on the link to confirm your email <a href = '${url}'>Click here</a>
                  // </div>`,
                })
                .then((info) => {
                  console.log({ info });
                })
                .catch(console.error);

              res.status(200).send({ message: 'User registered successfully!' });
              // });
            });
            // } else {
            //   // user role = 1
            //   user.setRoles([1]).then(() => {
            //     res.send({ message: 'User registered successfully!' });
            //   });
          }
        })

        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })

    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send({ message: 'Company Error:' + err.message });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  // const name = req.params.name;
  //var condition = name ? { FullName: { [Op.iLike]: `%${name}%` } } : null;{ where: condition }

  User.findAll({
    include: [
      {
        model: Company,
        attributes: ['CompanyName', 'CompanyType', 'CompanyId'],
      },
      {
        model: Role,
        attributes: ['Name'],
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

exports.findAllBySearch = (req, res) => {
  const name = req.params.name;
  var condition = name ? { FullName: { [Op.iLike]: `%${name}%` } } : null;

  User.findAll({
    where: condition,
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: Role,
        attributes: ['Name'],
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.userId;

  User.findOne({
    where: { UserId: id },
    include: [
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: Role,
        attributes: ['Name'],
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
      console.log('err', err);
      res.status(500).send({
        message: 'Error retrieving User with UserId=' + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.body.UserId;

  const imagePath = req.file.filename;

  User.update(req.body, {
    where: { UserId: id },
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

exports.updateUserRole = (req, res) => {
  const id = req.body.UserId;

  UserRole.update(req.body, {
    where: { UserId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User Role was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User Role with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating User with id=' + id,
      });
    });
};

exports.updateFile = (req, res) => {
  // console.log('req.body.UserId', req.body.UserId);
  User.findOne({
    where: {
      UserId: req.body.UserId,
    },
  }).then((user) => {
    if (user) {
      console.log('user', user);
      const uploadFile = req.file ? req.file : null;

      const picpath = uploadFile ? `${user.CompanyId}/${user.Email}/${uploadFile.originalname}` : '';

      var condition = req.body.FileType === 'image' ? { UserPicUrl: picpath } : { UserPicUrl: picpath };
      console.log('condition', condition);
      User.update(condition, {
        where: { UserId: req.body.UserId },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: 'File uploaded successfully.',
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
    } else {
      res.status(500).send({
        message: 'Error updating the record',
      });
    }
  });

  // const dir = `./uploads/${req.body.CompanyId}/${req.body.Email}`;
  // fs.exists(dir, (exist) => {
  //   if (!exist) {
  //     return fs.mkdir(dir, { recursive: true }, (err, info) => {
  //          console.log(err);
  //         });
  //   }
  // });
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
        message: err.message || 'Some error occurred while retrieving Users.',
      });
    });
};

//get Roles

exports.findRoles = (req, res) => {
  const name = req.params.name;
  var condition = name ? { Name: { [Op.iLike]: `%${name}%` } } : null;

  Role.findAll({ where: condition })
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

exports.findUserRoles = (req, res) => {
  const userId = req.params.userId;
  var condition = userId ? { UserId: userId } : null;

  UserRole.findAll({ where: condition })
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

exports.updateRole = (req, res) => {
  const id = req.params.roleId;

  Role.update(req.body, {
    where: { RoleId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Role was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Role with id=${id}. Maybe Company was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Role with id=' + id,
      });
    });
};

exports.deleteRole = (req, res) => {
  const id = req.params.roleId;

  Role.destroy({
    where: { RoleId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Role was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Role with id=${id}. Maybe Company was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Role with id=' + id,
      });
    });
};

exports.createCompany = (req, res) => {
  // Validate request

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
        message: 'Company was added successfully',
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

exports.uploadCompanyDoc = (req, res) => {
  // console.log('req.body.UserId', req.body.UserId);
  User.findOne({
    where: {
      UserId: req.body.UserId,
    },
  }).then((user) => {
    if (user) {
      console.log('user', user);
      const uploadFile = req.file ? req.file : null;

      const picpath = uploadFile ? `${user.CompanyId}/${user.Email}/${uploadFile.originalname}` : '';

      var condition = req.body.FileType === 'image' ? { UserPicUrl: picpath } : { UserPicUrl: picpath };
      console.log('condition', condition);
      User.update(condition, {
        where: { UserId: req.body.UserId },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: 'File uploaded successfully.',
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
    } else {
      res.status(500).send({
        message: 'Error updating the record',
      });
    }
  });

 
};

exports.findCompany = (req, res) => {
  const id = req.params.companyId;

  Company.findOne({ where: { CompanyId: id } })

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
  const CompanyType = req.query.companyType;
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
  const id = req.params.companyId;

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
  // Add user to Subscription

  const UserId = req.body.UserId;

  const IsSubscribed = UserSubscription.findAll({ where: { UserId: UserId, Active: true } });

  if (IsSubscribed) {
    return res.status(409).send('User Already Subscribed. Do you want to upgrade your subscription?');
  }

  // Get the subscription package

  Subscription.findOne({ where: { SubscribeId: req.body.SubscriptionId } }).then((subscribeRes) => {
    let startDate = new Date();

    let endDate = new Date();
    endDate.setDate(endDate.getDate() + parsInt(subscribeRes.Duration));

    const subscribe = {
      SubscriptionId: req.body.SubscriptionId,
      SubscriptionName: req.body.SubscriptionName,
      UserId: req.body.UserId,
      Active: true,
      StartDate: startDate,
      EndDate: endDate,
    };

    UserSubscription.create(subscribe).then((UserSubscribed) => {
      if (UserSubscribed) {
        return res.status(201).send({ message: `User Subscribed to  ${subscribeRes.SubscriptionName} package.` });
      }
    });
  });

  const User = User.findOne({ where: { UserId: UserId } });

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
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
  const id = req.body.UserSubscriptionId;

  const UserId = req.body.UserId;

  UserSubscription.findAll({ where: { UserId: UserId, Active: true } })

    .then((IsSubscribed) => {
      if (IsSubscribed) {
        UserSubscription.update(
          { Active: false },
          {
            where: {
              UserId: UserId,
            },
          },
        );
      }

      // Get the subscription package
      console.log('req.body.SubscriptionId', req.body.SubscriptionId);
      Subscription.findOne({ where: { SubscribeId: req.body.SubscriptionId } }).then((subscribeRes) => {
        console.log('subscribeRes', subscribeRes);
        let startDate = new Date();

        let endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(subscribeRes.Duration));

        const subscribe = {
          SubscribeId: req.body.SubscriptionId,
          SubscriptionName: subscribeRes.SubscriptionName,
          UserId: req.body.UserId,
          Active: true,
          StartDate: startDate,
          EndDate: endDate,
        };

        UserSubscription.create(subscribe).then((UserSubscribed) => {
          if (UserSubscribed) {
            return res.status(201).send({ message: `User Subscribed to  ${subscribeRes.SubscriptionName} package.` });
          }
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
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
  const id = req.params.userId;

  UserSubscription.findOne({
    where: { UserId: id, Active: true },

    include: {
      model: User,
      attributes: ['FullName', 'Email', 'PaymentMethod', 'Currency'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`error`, err);
      res.status(500).send({
        message: 'Error retrieving User with UserId=' + id,
      });
    });
};

exports.findAllUserSubscriptions = (req, res) => {
  const subscriptionId = req.param.subscriptionId;
  var condition = subscriptionId ? { SubscribeId: subscriptionId } : null;

  UserSubscription.findAll({
    where: condition,
    include: {
      model: User,
      attributes: ['FullName', 'Email', 'PaymentMethod', 'Currency'],
    },
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      console.log(`data`, data);
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
    include: {
      model: User,
      attributes: ['FullName', 'Email', 'PaymentMethod', 'Currency'],
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
    include: {
      model: User,
      attributes: ['FullName', 'Email', 'PaymentMethod', 'Currency'],
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
    include: {
      model: User,
      attributes: ['FullName', 'Email', 'PaymentMethod', 'Currency'],
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

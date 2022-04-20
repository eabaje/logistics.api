require('../config/db.postgres.config');
var generator = require('generate-password');
require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = require('../models/index.model');
const { exit } = require('process');
const User = db.user;
const Role = db.role;
const UserRole = db.userrole;
const Company = db.company;
const Subscribe = db.subscribe;
const UserSubscription = db.usersubscription;

//const authware = require('../middleware/auth');

const auth = express();

auth.use(express.json({ limit: '50mb' }));

// auth.get("/welcome", authware, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });

// // This should be the last route else any after it won't work
// auth.use("*", (req, res) => {
//   res.status(404).json({
//     success: "false",
//     message: "Page not found",
//     error: {
//       statusCode: 404,
//       message: "You reached a route that is not defined on this server",
//     },
//   });
// });

// module.exports = auth;

exports.signup = (req, res) => {
  User.findOne({
    where: {
      Email: req.body.Email,
    },
  }).then((user) => {
    if (user) {
      return res.status(404).send({ message: 'Email already exists' });
    } else {
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
                  // Get free subscription
                  // const free = 'Free';
                  //  var condition = free ? { SubscriptionType: { [Op.iLike]: `%${free}%` } } : null;
                  const subscribePrk = 1;
                  Subscribe.findOne({
                    where: {
                      SubscribeId: subscribePrk,
                    },
                  }).then((subscribeRes) => {
                    if (subscribeRes) {
                      // Add user free subscription
                      const startDate = new Date();

                      const endDate = new Date();
                      endDate.setDate(endDate.getDate() + subscribeRes.Duration);

                      UserSubscription.create({
                        // UserSubscriptionId: 2,
                        SubscribeId: subscribeRes.SubscribeId,
                        SubscriptionName: subscribeRes.SubscriptionName,
                        UserId: user.UserId,
                        Active: subscribeRes.Active,
                        StartDate: startDate,
                        EndDate: endDate,
                      }).then((userSubscription) => {});
                      const subscribeObj = {
                        SubscribeId: subscribeRes.SubscribeId,
                        SubscriptionName: subscribeRes.SubscriptionName,
                        UserId: user.UserId,
                        Active: subscribeRes.Active,
                        StartDate: startDate,
                        EndDate: endDate,
                      };
                      console.log('subscribeObj', subscribeObj);
                      //  UserSubscription.create(subscribeObj);
                    }
                  });

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
              console.log(`err`, err);
              res.status(500).send({ message: err.message });
            });
        })

        .catch((err) => {
          console.log(`err`, err);
          res.status(500).send({ message: 'Company Error:' + err.message });
        });
    }
  });
};

exports.signin = (req, res) => {
  // where: { [Op.and]: [{ Email: req.body.Email }, { IsActivated: true }] },
  User.findOne({
    where: { Email: req.body.Email },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);

      if (!passwordIsValid) {
        return res.status(401).send({
          //  Token: null,
          message: 'Invalid Password!',
        });
      }
    
      // var token = jwt.sign({ id: user.UserId }, process.env, {
      //   expiresIn: 86400, // 24 hours
      // }); .toUpperCase()
      const token = jwt.sign({ UserId: user.UserId }, `${process.env.ACCESS_TOKEN_SECRET}`, {
        expiresIn: '86400s',
      });
      const refreshToken = jwt.sign({ UserId: user.UserId }, `${process.env.REFRESH_TOKEN_SECRET}`, {
        expiresIn: '2d',
      });
      user.Token=refreshToken;
      user.save();
      var authorities = [];
      UserRole.findOne({
        where: { UserId: user.UserId },
      }).then((userrole) => {
        if (!userrole) {
          return res.status(404).send({ message: 'User does not have a Role.' });
        }
        Role.findOne({
          where: { RoleId: userrole.RoleId },
        }).then((role) => {
          // for (let i = 0; i < userrole.length; i++) {
          //   authorities.push(userrole[i].Name);
          // }
          Company.findOne({
            where: { CompanyId: user.CompanyId },
          }).then((company) => {
            res.status(200).send({
              message: 'Success',
              token: token,

              user: {
                UserId: user.UserId,
                FullName: user.FullName,
                Email: user.Email,
                CompanyId: user.CompanyId,
                CompanyName: company.CompanyName,
                roles: role.Name,
                UserPicUrl: user.UserPicUrl,
              },
            });
         //   res.cookie('jwt',refreshToken,{httpOnly:true,MaxAge:24*60*60*1000});
          });
        });
      });
    })
    .catch((err) => {
      console.log('state:', err.message);
      res.status(500).send({ message: err.message });
    });
};

exports.reset = (req, res) => {
  // where: { [Op.and]: [{ Email: req.body.Email }, { IsActivated: true }] },
  console.log('req.body.Email', req.body.Email);
  User.findOne({
    where: { Email: req.body.Email },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      const id = user.UserId;
      const encryptedPassword = req.body.Password
        ? bcrypt.hashSync(req.body.Password, 10)
        : bcrypt.hashSync(generator.generate({ length: 8, numbers: true }), 10);

      User.update(
        { Password: encryptedPassword },
        {
          where: { UserId: user.UserId },
        },
      )
        .then((num) => {
          if (num == 1) {
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
            transporter.sendMail({
              from: `${process.env.FROM_EMAIL}`,
              to: req.body.Email,
              template: 'emailPassword', // the name of the template file i.e email.handlebars
              context: {
                name: user.FullName,
                password: encryptedPassword,
              },
              subject: 'Password Reset',
              //     html: `<h1>Email Confirmation</h1>
              // <h2>Hello ${fullname}</h2>

              // <p>Password: `${encryptedPassword}`By signing up for a free 90 day trial with Load Dispatch Service, you can connect with carriers,shippers and drivers.<br/></p>
              // To finish up the process kindly click on the link to confirm your email <a href = '${url}'>Click here</a>
              // </div>`,
            });

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
    })
    .catch((err) => {
      console.log('state:', err.message);
      res.status(500).send({ message: err.message });
    });
};

exports.verify = (req, res) => {
  const token = req.params.token;
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: 'Missing Token',
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(500).send(err);
  }
  console.log(`payload`, payload.UserId);
  User.findOne({
    where: { UserId: payload.UserId },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      user.IsActivated = true;
      user.save();
      console.log(`payload`, payload.UserId);
      console.log('User:', user.UserId);
      User.findOne({ where: { UserId: user.UserId, IsActivated: true } }).then((isActivated) => {
        if (!isActivated) {
          return res.status(404).send({
            message: 'Kindly click to confirm again',
          });
        }
      });

      return res.redirect(process.env.ADMIN_URL);
    })
    .catch((err) => {
      console.log('Error:', err.message);
      return res.status(500).send({ message: err.message });
    });
};

exports.activation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      } else {
        const { name, email, password } = jwt.decode(token);

        console.log(email);
        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log('Save error', errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              data: user,
              message: 'Signup success',
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'error happening please try again',
    });
  }
};

exports.logout = async(req, res) => {
  

  const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);

};

exports.redirect = (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/');
};

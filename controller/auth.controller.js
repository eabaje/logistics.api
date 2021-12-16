require('dotenv').config();
require('../config/db.postgres.config');
var generator = require('generate-password');

const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = require('../models/index.model');
const User = db.user;
const Role = db.role;
const UserRole = db.userrole;
const Company = db.company;

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
    }
  });

  //  var password = generator.generate({length: 8,numbers: true,})

  // const company = Company.create({
  //   CompanyName: req.body.CompanyName,
  //   ContactEmail: req.body.ContactEmail,
  //   ContactPhone: req.body.ContactPhone,
  //   Address: req.body.CompanyAddress,
  //   Region: req.body.Region,
  //   Country: req.body.Country,
  //   CompanyType: req.body.CompanyType,
  // });

  Company.create({
    CompanyName: req.body.CompanyName,
    ContactEmail: req.body.ContactEmail,
    ContactPhone: req.body.ContactPhone,
    Address: req.body.CompanyAddress,
    Region: req.body.Region,
    Country: req.body.Country,
    CompanyType: req.body.CompanyType,
  })
    .then((company) => {
      //const company = Company.save();
      encryptedPassword = req.body.Password
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
          if (req.body.CompanyType) {
            Role.findOne({
              where: {
                Name: req.body.CompanyType,
              },
            }).then((role) => {
              UserRole.create({ UserId: user.UserId, RoleId: role.RoleId });

              // Add User Subscription
              // user.setRoles(roles).then(() => {
              const token = jwt.sign({ UserId: User.UserId }, process.env.TOKEN_KEY, {
                expiresIn: '2h',
              });
              // save user token
              //   user.Token = token;

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD,
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

              const url = process.env.BASE_URL + `auth/verify/${token}`;
              transporter
                .sendMail({
                  from: process.env.FROM_EMAIL,
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

              // const msg = {
              //   from: process.env.FROM_EMAIL,
              //   to: email,
              //   subject: 'Welcome to Global Load Dispatch',
              //   html: `<h1>Email Confirmation</h1>
              // <h2>Hello ${fullname}</h2>

              // <p>By signing up for a free 90 day trial with Load Dispatch Service, you can connect with carriers,shippers and drivers.<br/></p>
              // To finish up the process kindly click on the link to confirm your email <a href = '${url}'>Click here</a>
              // </div>`,
              // };

              // sgMail.send(msg).then(
              //   () => {},
              //   (error) => {
              //     console.error(error);

              //     if (error.response) {
              //       console.error(error.response.body);
              //     }
              //   },
              // );
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
      res.status(500).send({ message: 'Company Error:' + err.message });
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
      // });
      const token = jwt.sign({ UserId: User.UserId }, process.env.TOKEN_KEY, {
        expiresIn: '86400',
      });
      var authorities = [];
      UserRole.findOne({
        where: { UserId: user.UserId },
      }).then((userrole) => {
        if (!userrole) {
          return res.status(404).send({ message: 'User Not found.' });
        }
        for (let i = 0; i < userrole.length; i++) {
          authorities.push(userrole[i].name.toUpperCase());
        }

        res.status(200).send({
          message: 'Success',
          token: token,
          roles: authorities,

          data: {
            UserId: user.UserId,
            UserName: user.UserName,
            FullName: user.FullName,
            Email: user.Email,
            CompanyId: user.CompanyId,
          },
        });
      });
    })
    .catch((err) => {
      console.log('state:', err.message);
      res.status(500).send({ message: err.message });
    });
};

exports.verify = async (req, res) => {
  const { token } = req.params;
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
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ UserId: payload.UserId });
    if (!user) {
      return res.status(404).send({
        message: 'User does not  exist',
      });
    }
    // Step 3 - Update user verification status to true
    user.IsActivated = true;

    await user.save();
    return res.redirect(process.env.ADMIN_URL);
    // return res.status(200).send({
    //   message: 'Account Verified',
    // });
  } catch (err) {
    return res.status(500).send(err);
  }
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

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.redirect = (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/');
};

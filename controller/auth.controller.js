require('dotenv').config();
require('../config/db.postgres.config');

const nodemailer = require('nodemailer');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models/index.model');
const User = db.user;
const Role = db.role;

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
  const user = {
    FirstName: req.body.FirstName,
    LasttName: req.body.LastName,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Address: req.body.Address,
    City: req.body.City,
    Country: req.body.Country,
    UserPicUrl: req.body.UserPicUrl,
    UserName: req.body.Email,
    // Password: '',
    // UserDocs: req.body.UserDocs
  };
  // Save User in the database

  encryptedPassword = bcrypt.hash(password, 10);

  User.create({
    FullName: FirstName + ' ' + LastName,
    Email: Email.toLowerCase(),
    Phone: Phone,
    Address: Address,
    City: City,
    Country: Country,
    UserName: Email.toLowerCase(),
    // sanitize: convert email to lowercase
    password: encryptedPassword,
  })
    .then((user) => {
      if (req.body.Roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.Roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            const token = jwt.sign({ UserId: User.UserId }, process.env.TOKEN_KEY, {
              expiresIn: '2h',
            });
            // save user token
            user.Token = token;

            const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
            //  mailgun
            // Step 2 - Generate a verification token with the user's ID
            const verificationToken = user.generateVerificationToken();
            // Step 3 - Email the user a unique verification link
            const url = process.env.BASE_URL + '/verify/${token}';
            transporter.sendMail({
              to: email,
              subject: 'Verify Account',
              html: `<h1>Email Confirmation</h1>
              <h2>Hello ${FirstName + ' ' + LastName}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href = '${url}'>Click here</a>
              </div>`,
            });

            //   res.send({ message: 'User registered successfully!' });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: 'User registered successfully!' });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      UserName: req.body.UserName,
    },
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

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
        res.status(200).send({
          message: 'Success',
          data: {
            UserId: user.UserId,
            UserName: user.UserName,
            Email: user.Email,
            Roles: authorities,
            Token: token,
          },
        });
      });
    })
    .catch((err) => {
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
    const user = await User.findOne({ UserId: payload.UserId }).exec();
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

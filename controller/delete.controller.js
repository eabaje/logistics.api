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
const Op = db.Sequelize.Op;

exports.delete = (req, res) => {
  const id = req.body.UserId;

  cars = await db.sequelize.query('SELECT "id" FROM Cars" WHERE "Cars"."ownerId" = (:id)', {
    replacements: {id: req.user.id},
    type: db.sequelize.QueryTypes.SELECT
  });


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

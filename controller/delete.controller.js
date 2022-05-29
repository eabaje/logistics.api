require('../config/db.postgres.config');
var generator = require('generate-password');
require('dotenv').config();

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const db = require('../models/index.model');
const { exit } = require('process');
const Op = db.Sequelize.Op;

exports.deleteRecord = async (req, res) => {
  try {
    const del = await db.sequelize.query('DELETE  FROM (:tbl) WHERE (:fld) = (:val)', {
      replacements: { tbl: req.body.tbl, fld: req.body.fld, val: req.body.val },
      type: db.sequelize.QueryTypes.DELETE,
    });

    if (del > 0) {
      res.send({
        message: 'Record was deleted successfully!',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Could not delete record',
    });
  }
};

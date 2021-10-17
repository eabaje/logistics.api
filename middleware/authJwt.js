const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models/index.model.js');
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Admin Role!',
      });
      return;
    });
  });
};

isShipper = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'shipper') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Shipper Role!',
      });
    });
  });
};

isCarrier = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'carrier') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Carrier Role!',
      });
    });
  });
};

isDriver = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'driver') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Driver Role!',
      });
    });
  });
};

isAuditorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'auditor') {
          next();
          return;
        }

        if (roles[i].name === 'admin') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Auditor or Admin Role!',
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isShipper: isShipper,
  isCarrier: isCarrier,
  isDriver: isDriver,
  isAuditorOrAdmin: isAuditorOrAdmin,
};
module.exports = authJwt;

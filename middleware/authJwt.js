const jwt = require('jsonwebtoken');
//const config = require('../config/auth.config.js');
const db = require('../models/index.model.js');
const User = db.user;

const config = process.env;

 verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

verifyTokenv1 = (req, res, next) => {
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

isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, config.secret || 'somethingsecret', (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
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

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};
const authJwt = {
  verifyToken: verifyToken,
  isAuth: isAuth,
  isAdmin: isAdmin,
  isShipper: isShipper,
  isCarrier: isCarrier,
  isDriver: isDriver,
  isAuditorOrAdmin: isAuditorOrAdmin,
  checkRolesExisted: checkRolesExisted,
};
module.exports = authJwt;

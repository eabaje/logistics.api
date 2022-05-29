const { authJwt } = require('../middleware');
const controller = require('../controller/delete.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/delete/deleteRecord', controller.deleteRecord);
};

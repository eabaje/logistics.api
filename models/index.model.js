require('dotenv').config();
const dbConfig = require('../config/db.postgres.config.js');

const env = process.env.NODE_ENV.trim() || 'development';

console.log(env);

const config = require('../config/config.json')[env];

const isProduction = process.env.NODE_ENV;

const Sequelize = require('sequelize');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], null, null, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// if (isProduction === 'production') {
// } else {
//   sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,

//     pool: {
//       max: dbConfig.pool.max,
//       min: dbConfig.pool.min,
//       acquire: dbConfig.pool.acquire,
//       idle: dbConfig.pool.idle,
//     },
//   });
// }

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.carrier = require('./carrier.model.js')(sequelize, Sequelize);
db.company = require('./company.model.js')(sequelize, Sequelize);
db.driver = require('./driver.model.js')(sequelize, Sequelize);
db.vehicle = require('./vehicle.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.shipment = require('./shipment.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.payment = require('./payment.model.js')(sequelize, Sequelize);
db.subscribe = require('./subscription.model.js')(sequelize, Sequelize);
db.trip = require('./trip.model.js')(sequelize, Sequelize);
db.assigndriver = require('./assign.driver.model.js')(sequelize, Sequelize);
db.usersubscription = require('./user.subscription.model.js')(sequelize, Sequelize);
db.insurance = require('./insurance.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: 'UserRoles',
  foreignKey: 'RoleId',
  otherKey: 'UserId',
});
db.user.belongsToMany(db.role, {
  through: 'UserRoles',
  foreignKey: 'UserId',
  otherKey: 'RoleId',
});

db.trip.hasMany(db.shipment, { as: 'Shipments' });
db.shipment.belongsTo(db.shipment, {
  foreignKey: 'TripId',
  as: 'Trips',
});

db.ROLES = ['shipper', 'admin', 'auditor', 'driver', 'carrier', 'broker'];

module.exports = db;

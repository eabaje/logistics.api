require('dotenv').config();
const dbConfig = require('../config/db.postgres.config.js');

const env = process.env.NODE_ENV.trim() || 'development';

const config = require(__dirname + '/../config/config.json')[env];

console.log(process.env[config.use_env_variable]);

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
db.userrole = require('./user.role.model.js')(sequelize, Sequelize);
db.shipment = require('./shipment.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.payment = require('./payment.model.js')(sequelize, Sequelize);
db.subscribe = require('./subscription.model.js')(sequelize, Sequelize);
db.trip = require('./trip.model.js')(sequelize, Sequelize);
db.track = require('./track.model.js')(sequelize, Sequelize);
db.assigndriver = require('./assign.driver.model.js')(sequelize, Sequelize);
db.usersubscription = require('./user.subscription.model.js')(sequelize, Sequelize);
db.insurance = require('./insurance.model.js')(sequelize, Sequelize);
db.interested = require('./shipment.interested.model.js')(sequelize, Sequelize);
db.media = require('./media.model.js')(sequelize, Sequelize);

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

db.company.hasMany(db.carrier, {foreignKey: 'fk_Carrier_CompanyId'});
db.carrier.belongsTo(db.company, {foreignKey: 'fk_Carrier_CompanyId', targetKey: 'CompanyId'});

db.user.belongsTo(db.company, {foreignKey: 'fk_User_CompanyId', targetKey: 'CompanyId'});


//db.company.belongsTo(db.user, {foreignKey: 'CompanyId'});

//db.company.hasMany(db.driver, {foreignKey: 'CompanyId'});
db.driver.belongsTo(db.company, {foreignKey: 'fk_Driver_CompanyId', targetKey: 'CompanyId'});

db.user.hasMany(db.usersubscription, {foreignKey: 'fk_UserId'});
db.usersubscription.belongsTo(db.user, {foreignKey: 'fk_UserId' , targetKey: 'UserId'});


db.shipment.hasMany(db.interested, {foreignKey: 'fk_Interested_ShipmentId'});
db.interested.belongsTo(db.shipment, {foreignKey: 'fk_Interested_ShipmentId', targetKey: 'ShipmentId'});

db.interested.belongsTo(db.driver, {foreignKey: 'fk_Interested_DriverId', targetKey: 'DriverId'});
//db.shipment.belongsTo(db.interested, {foreignKey: 'UserId'});

db.ROLES = ['shipper', 'admin', 'auditor', 'driver', 'carrier', 'broker'];  

module.exports = db;

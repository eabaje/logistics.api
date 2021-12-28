require('dotenv').config();
const multer = require('multer');
const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
var uuid = require('uuid');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
// const session = require('express-session');
//cors
const cors = require('cors');
app.use(cors());

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./models/index.model');
const { subscribe } = require('./models/index.model');
const Role = db.role;
const User = db.user;
const UserRole = db.userrole;
const Company = db.company;
const Subscription = db.subscribe;
const UserSubscription = db.usersubscription;
//db.sequelize.sync();
//force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// app.use(
//   session({
//     secret: 's3cr3t',
//     resave: true,
//     saveUninitialized: true,
//   }),
// );
// app.use(passport.initialize());
// app.use(passport.session());
// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Loadboard Logistics api.' });
});
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Loadboard Logistics api.' });
});

// set port, listen for requests
//const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// routes
require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/carrier.route')(app);
require('./routes/driver.route')(app);
require('./routes/vehicle.route')(app);
require('./routes/shipment.route')(app);
require('./routes/trip.route')(app);
require('./routes/order.route')(app);
require('./routes/payment.route')(app);
require('./routes/subscription.route')(app);
require('./routes/upload.route')(app);

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//const { v1: uuidv1, v4: uuidv4 } = require('uuid');

//bcrypt.hashSync(req.body.password, 8)
function initial() {
  const { v1: uuidv1, v4: uuidv4 } = require('uuid');
  encryptedPassword = bcrypt.hashSync('Web@6790', 8);
  initialUserId = uuidv4();
  shipperRoleId = uuidv4();
  carrierRoleId = uuidv4();
  adminRoleId = uuidv4();
  auditorRoleId = uuidv4();
  driverRoleId = uuidv4();
  brokerRoleId = uuidv4();
  usersubscribeId = uuidv4();

  let startDate = new Date();

  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 90);

  Company.create({
    CompanyId: 1,
    CompanyName: 'Global Load dispatch',
    ContactEmail: 'ebi.abaje@loaddispatch.com.ng',
    ContactPhone: '08057886381',
    CompanyType: 'admin',
    Address: 'Lagos',
    City: 'Lagos',
    Country: 'NG',
  });

  Subscription.create({
    SubscribeId: 1,
    SubscriptionType: 'free Trial',
    SubscriptionName: 'Free 90 Day Trial',
    Amount: 0.0,
    Description: 'Basic ',
    Active: true,
    Duration: 90,
  });

  UserSubscription.create({
    UserSubscriptionId: 1,
    SubscriptionId: 1,
    SubscriptionName: 'Free 90 Day Trial',
    UserId: initialUserId,
    Active: true,
    StartDate: startDate,
    EndDate: endDate,
  });

  Role.create({
    RoleId: shipperRoleId,
    Name: 'shipper',
  });

  Role.create({
    RoleId: driverRoleId,
    Name: 'driver',
  });

  Role.create({
    RoleId: carrierRoleId,
    Name: 'carrier',
  });
  Role.create({
    RoleId: brokerRoleId,
    Name: 'broker',
  });
  Role.create({
    RoleId: adminRoleId,
    Name: 'admin',
  });

  Role.create({
    RoleId: auditorRoleId,
    Name: 'auditor',
  });

  User.create({
    UserId: initialUserId,
    FullName: 'Ebi Abaje',
    Email: 'ebi.abaje@loaddispatch.com.ng',
    Phone: '08057886381',
    UserName: 'ebi.abje@loaddispatch.com.ng',
    Password: encryptedPassword,
    Address: 'Lagos',
    City: 'LG',
    Country: 'NG',
    IsActivated: false,
    CompanyId: 1,
  });

  UserRole.create({
    UserId: initialUserId,
    RoleId: adminRoleId,
  });
}

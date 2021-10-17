require('dotenv').config();
const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
var uuid = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
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
const Role = db.role;
const User = db.user;
const Company = db.company;
//db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

app.use(
  session({
    secret: 's3cr3t',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
// simple route
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

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

//bcrypt.hashSync(req.body.password, 8)
function initial() {
  encryptedPassword = bcrypt.hashSync('Web@6790', 8);
  User.create({
    UserId: uuidv4(),
    FullName: 'Ebi Abaje',
    Email: 'ebi.abaje@loardboard.io',
    Phone: '08057886381',
    UserName: 'ebi.abje@loardboard.io',
    Password: encryptedPassword,
    Address: 'Lagos',
    City: 'Lagos',
    Country: 'NG',
    IsActivated: false,
  });

  Company.create({
    ComapnyId: 1,
    CompanyName: 'Loadboard logistics',
    ContactEmail: 'ebi.abaje@loardboard.io',
    ContactPhone: '08057886381',
    CompanyType: 'Shipper',
    Address: 'Lagos',
    City: 'Lagos',
    Country: 'NG',
  });

  Role.create({
    RoleId: uuidv4(),
    Name: 'shipper',
  });

  Role.create({
    RoleId: uuidv4(),
    Name: 'driver',
  });

  Role.create({
    RoleId: uuidv4(),
    Name: 'carrier',
  });
  Role.create({
    RoleId: uuidv4(),
    Name: 'broker',
  });
  Role.create({
    RoleId: uuidv4(),
    Name: 'admin',
  });

  Role.create({
    RoleId: uuidv4(),
    Name: 'auditor',
  });
}

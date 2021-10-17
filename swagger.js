const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/auth.route.js',
  './routes/user.route.js',
  './routes/carrier.route.js',
  './routes/driver.route.js',
  './routes/vehicle.route.js',
  './routes/shipment.route.js',
  './routes/payment.route.js',
  './routes/order.route.js',
  './routes/subscription.route.js',
  './routes/trip.route.js',
];

swaggerAutogen(outputFile, endpointsFiles);

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require('./server.js');
});

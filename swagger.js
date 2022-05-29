const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/auth.routes.js',
  './routes/carrier.routes.js',
  './routes/delete.routes.js',
  './routes/driver.routes.js',
  './routes/order.routes.js',
  './routes/payment.routes.js',
  './routes/shipment.routes.js',
  './routes/subscription.routes.js',
  './routes/trip.routes.js',
  './routes/upload.routes.js',
  './routes/user.routes.js',
  './routes/vehicle.routes.js',
];

swaggerAutogen(outputFile, endpointsFiles);

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require('./server.js');
});

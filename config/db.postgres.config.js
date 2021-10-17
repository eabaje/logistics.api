require('dotenv').config();
module.exports = {
  HOST: process.env.DBHOST,
  USER: process.env.DBUSER,
  PASSWORD: process.env.DBPASS,
  DB: process.env.DB,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const Pool = require('pg').Pool;
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = pool;

require('dotenv').config();
const logger = require('../utils/logger');

module.exports = {
  
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    multipleStatements: true,
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: process.env.DB_LOGGING === 'true' ? true : false
  },
  production: {
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    multipleStatements: true,
    dialectOptions: {
      // socketPath: `/cloudsql/${process.env.PROD_DB_SOCKET}`,
      dateStrings: true,
      typeCast: true,
      timezone: '+08:00',
    },
    timezone: '+08:00',
    logging: msg => logger.debug(msg)
  }
}; 
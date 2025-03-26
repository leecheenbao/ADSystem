const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const config = require('./databaseConfig');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
console.log("-----------Database Config----------")
console.log(dbConfig);
const sequelize = new Sequelize(dbConfig);

// 測試連接
sequelize.authenticate()
    .then(() => {
        console.log('數據庫連接成功');
    })
    .catch(err => {
        console.log('數據庫連接失敗:', err);
    });

module.exports = sequelize;

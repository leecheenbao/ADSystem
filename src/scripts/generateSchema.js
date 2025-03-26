const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const logger = require('../src/utils/logger');
require('dotenv').config();

// 創建 Sequelize 實例
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            timezone: '+08:00'
        },
        timezone: '+08:00'
    }
);

async function generateSchema() {
    try {
        // 測試數據庫連接
        await sequelize.authenticate();
        logger.info('數據庫連接成功');

        // 使用 show tables 獲取所有表格名稱
        const [results] = await sequelize.query('SHOW TABLES');
        const tables = results.map(result => Object.values(result)[0]);
        
        let schemaSQL = '-- 資料庫結構導出\n\n';
        
        // 獲取每個表的創建語句
        for (const table of tables) {
            logger.info(`正在處理表格: ${table}`);
            
            // 獲取表註釋
            const [tableInfo] = await sequelize.query(
                `SHOW TABLE STATUS WHERE Name = :tableName`,
                {
                    replacements: { tableName: table },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            
            const tableComment = tableInfo?.Comment || '';
            
            schemaSQL += `-- ${table} 表結構 ${tableComment ? `(${tableComment})` : ''}\n`;
            
            // 獲取建表語句
            const [createTableResults] = await sequelize.query(
                `SHOW CREATE TABLE ${table}`,
                { raw: true }
            );
            
            if (createTableResults?.[0]?.['Create Table']) {
                schemaSQL += createTableResults[0]['Create Table'] + ';\n\n';
            } else {
                logger.warn(`無法獲取表 ${table} 的建表語句`);
            }
        }

        // 確保 sql 目錄存在
        const sqlDir = path.join(__dirname, '../sql');
        if (!fs.existsSync(sqlDir)) {
            fs.mkdirSync(sqlDir, { recursive: true });
        }

        // 生成檔名
        const timestamp = new Date().toISOString()
            .replace(/[-:T]/g, '')
            .substring(0, 15);
        const filePath = path.join(sqlDir, `tables_schema.sql`);
        
        // 寫入文件
        fs.writeFileSync(filePath, schemaSQL, 'utf8');
        logger.info(`Schema 已成功導出到 ${filePath}`);

    } catch (error) {
        logger.error(`生成 Schema 時發生錯誤:`, error);
        throw error;
    } finally {
        // 確保關閉數據庫連接
        await sequelize.close();
    }
}

// 執行腳本
generateSchema()
    .then(() => {
        logger.info('Schema 生成完成');
        process.exit(0);
    })
    .catch(error => {
        logger.error('Schema 生成失敗:', error);
        process.exit(1);
    }); 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./src/config/passport');
const rateLimit = require('express-rate-limit');
const { rateLimit: rateLimitConfig } = require('./src/middlewares/validator');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const { testEncryption } = require('./src/utils/encryption');

const BASE_URL = process.env.BASE_URL || '/api/v1';

const authRoutes = require('./src/routes/01_authRoutes');
const userRoutes = require('./src/routes/02_userRoutes');
const articleRoutes = require('./src/routes/03_articleRoutes');
const medicalRoutes = require('./src/routes/04_medicalRoutes');
const otherRoutes = require('./src/routes/05_otherRoutes');
const adminRoutes = require('./src/routes/06_adminRoutes');

// const origin = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_HOST : '*';

// CORS 配置
const corsOptions = {
  origin: '*',  // 允許所有來源，生產環境建議設置具體域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

console.log(corsOptions);
const app = express();
console.log('--------------------------------');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`BASE_URL: ${BASE_URL}`);

// 設置信任代理
app.set('trust proxy', 1);

// 測試加密功能
if (!testEncryption()) {
    console.error('加密系統測試失敗，應用無法啟動');
    process.exit(1);
}

// 中間件
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 配置
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24小時
    },
    // 添加日誌
    logErrors: true
  })
);

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 應用速率限制
app.use(rateLimit(rateLimitConfig));

// 使用 morgan 進行 HTTP 請求日誌記錄
app.use(morgan('combined', { stream: logger.stream }));

// 認證路由
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// 路由
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/article`, articleRoutes);
app.use(`${BASE_URL}/medical`, medicalRoutes);
app.use(`${BASE_URL}/other`, otherRoutes);

app.use(express.static('public'));

// 錯誤處理
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port *** ${PORT} ***`);
  console.log('--------------------------------');
});

module.exports = app;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// 加載共用配置
dotenv.config({ path: path.resolve(process.cwd())});

// 根據 NODE_ENV 加載相應的環境文件
const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// 創建 transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // 使用 TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// 封裝發送郵件方法，支持自定義發件人名稱
const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: {
      name: process.env.GMAIL_SENDER_NAME || 'System Name',  // 自定義發件人名稱
      address: process.env.GMAIL_USER  // Gmail 地址
    },
    to,
    subject,
    html
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Gmail 發送錯誤:', error);
    throw error;
  }
};

module.exports = {
  transporter,
  sendMail
};
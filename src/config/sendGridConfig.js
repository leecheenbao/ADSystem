const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const path = require('path');
const ApiError = require("../utils/ApiError");

// 加載環境變數
dotenv.config({ path: path.resolve(process.cwd())});
const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// 檢查必要的環境變數
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in environment variables');
}

// 設定 SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("-----------SendGrid Config----------")
console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);
console.log("SENDGRID_FROM_EMAIL:", process.env.SENDGRID_FROM_EMAIL);
console.log("--------------------------------")
// 封裝發送郵件方法
const sendMail = async ({ from, to, subject, html }) => {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error('SENDGRID_FROM_EMAIL is not defined in environment variables');
  }

  const msg = {
    to,
    from: {
      email: from || process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME || 'System'  // 可選的發件人名稱
    },
    subject,
    html
  };

  try {
    const result = await sgMail.send(msg);
    return result;
  } catch (error) {
    // 更詳細的錯誤處理
    console.error('SendGrid Error Details:', {
      code: error.code,
      message: error.message,
      response: error.response?.body.errors,
    });

    if (error.code === 401) {
      throw new ApiError(500, 'SendGrid 驗證失敗，請檢查 API Key');
    } else if (error.code === 403) {
      throw new ApiError(500, '發送郵件權限不足');
    } else {
      throw new ApiError(500, '發送郵件失敗，請稍後再試');
    }
  }
};

module.exports = {
  sendMail
};
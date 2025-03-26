/**
 * 檢查必要參數是否存在
 * @param {Object} body - 請求體
 * @param {string[]} requiredParams - 必要參數列表
 * @returns {string[]} 缺少的參數列表
 */
const checkRequiredParams = (body, requiredParams) => {
  const missingParams = requiredParams.filter((param) => !body[param]);
  return missingParams;
};

/**
 * 驗證員工名（允許中文、英文字母、數字、底線_和點.及-還有空白符號）
 * @param {string} username - 員工名
 * @returns {boolean} 是否有效
 */
const isValidUsername = (username) => {
  // 只允許中文、英文字母、數字、底線_和點.及-還有空白符號
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9._\s-]+$/;
  return usernameRegex.test(username);
};

/**
 * 驗證郵箱（只允許英文字母、數字、底線和點）
 * @param {string} email - 郵箱地址
 * @returns {boolean} 是否有效
 */
const isValidEmail = (email) => {
  // 只允許英文字母、數字、底線和點及-，必須包含 @ 和域名
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 驗證員工輸入
 * @param {Object} input - 員工輸入
 * @returns {Object} 驗證結果
 */
const validateUserInput = (input) => {
  const errors = [];

  // 驗證員工名
  if (input.username) {
    if (!isValidUsername(input.username)) {
      errors.push('員工名只能包含中文和英文字母');
    }
    if (input.username.length < 2 || input.username.length > 50) {
      errors.push('員工名長度必須在 2-50 個字符之間');
    }
  }

  // 驗證郵箱
  if (input.email) {
    if (!isValidEmail(input.email)) {
      errors.push('郵箱格式不正確，只能包含英文字母、數字、底線和點');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 驗證密碼
const isValidPassword = (password) => {
  // TODO: 密碼驗證規則

  // 密碼長度至少 8 個字符
  return password.length >= 6;
};

// 檢查參數
const checkParams = (params, requiredParams) => {
  const missingParams = requiredParams.filter((param) => !params[param]);
  return missingParams;
};

module.exports = {
  checkRequiredParams,
  isValidUsername,
  isValidEmail,
  validateUserInput,
  isValidPassword,
  checkParams
};

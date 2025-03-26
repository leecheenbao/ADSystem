class ApiError extends Error {
  constructor(statusCode = 200, message = '系統錯誤') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // 捕獲堆疊跟踪
    Error.captureStackTrace(this, this.constructor);
  }

  static error(statusCode = 400, message = '系統錯誤') {
    return new ApiError(statusCode, message);
  }
}

module.exports = ApiError; 
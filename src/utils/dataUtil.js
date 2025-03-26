const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// 設置默認時區
const DEFAULT_TIMEZONE = 'Asia/Taipei';

/**
 * 格式化時間
 * @param {string|Date} date - 要格式化的時間
 * @param {string} format - 格式化模式，默認 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化後的時間字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return null;
    
    try {
        const formattedDate = dayjs(date)
            .tz(DEFAULT_TIMEZONE)
            .format(format);
        
        return formattedDate !== 'Invalid Date' ? formattedDate : null;
    } catch (error) {
        console.error('Format time error:', error);
        return null;
    }
};

/**
 * 格式化日期
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} 格式化後的日期字符串 YYYY-MM-DD
 */
const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD');
};

/**
 * 判斷是否為時間格式
 * @param {string} key - 欄位名稱
 * @returns {boolean}
 */
const isTimeField = (key) => {
    const timeFields = [
        'created_at',
        'updated_at',
        'deleted_at',
        'start_time',
        'end_time',
        'expire_at',
        'last_login_at'
    ];
    return timeFields.includes(key);
};

/**
 * 格式化資料中的時間欄位
 * @param {Object|Array} data - 要格式化的資料
 * @returns {Object|Array} 格式化後的資料
 */
const formatData = (data) => {
    // 如果是空值，直接返回
    if (!data) return data;

    // 如果是陣列，遞迴處理每個元素
    if (Array.isArray(data)) {
        return data.map(item => formatData(item));
    }

    // 如果是物件，處理每個屬性
    if (typeof data === 'object' && data !== null) {
        const formatted = {};
        
        for (const [key, value] of Object.entries(data)) {
            // 特殊處理 tags 字段
            if (key === 'tags' && typeof value === 'string') {
                try {
                    formatted[key] = JSON.parse(`[${value}]`);
                } catch (error) {
                    console.error(`Error parsing tags for key ${key}:`, error);
                    formatted[key] = null;
                }
            }
            // 特殊處理 banner 字段
            else if (key === 'banner' && typeof value === 'object') {
                formatted[key] = value; // 保持原樣
            }
            // 處理時間欄位
            else if (isTimeField(key)) {
                const formattedTime = formatTime(value);
                formatted[key] = formattedTime;
            }
            // 遞迴處理嵌套物件
            else if (value && typeof value === 'object' && !dayjs.isDayjs(value)) {
                formatted[key] = formatData(value);
            }
            else {
                formatted[key] = value;
            }
        }
        return formatted;
    }

    return data;
};

/**
 * 獲取當前時間
 * @param {string} format - 格式化模式，默認 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 當前時間字符串
 */
const getCurrentTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs().tz(DEFAULT_TIMEZONE).format(format);
};

/**
 * 檢查日期是否有效
 * @param {string} date - 要檢查的日期字符串
 * @returns {boolean} 是否為有效日期
 */
const isValidDate = (date) => {
    return dayjs(date).isValid();
};

/**
 * 獲取當前時間戳
 * @returns {number} 當前時間戳
 */
const getCurrentTimestamp = () => {
    return dayjs().tz(DEFAULT_TIMEZONE).unix();
};


/**
 * 轉換並格式化時間
 * @param {number} timestamp - 時間戳
 * @param {string} targetTimezone - 目標時區
 * @param {string} format - 格式化模式，默認 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化後的時間字符串
 */
const convertAndFormatTime = (timestamp, targetTimezone = DEFAULT_TIMEZONE, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timestamp || !targetTimezone) {
        throw new ApiError(400, '請提供有效的時間戳和目標時區');
      }
  
      try {
        const formattedTime = dayjs(timestamp)
          .tz(targetTimezone)
          .format(format);
  
        return formattedTime !== 'Invalid Date' ? formattedTime : null;
      } catch (error) {
        throw new ApiError(500, '時間格式化失敗：' + error.message);
      }
};


module.exports = {
    formatTime,
    formatDate,
    formatData,
    getCurrentTime,
    isValidDate,
    DEFAULT_TIMEZONE
};
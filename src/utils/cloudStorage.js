const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const path = require('path');

console.log("GCP_BUCKET_NAME:", process.env.GCP_BUCKET_NAME);

// 根據環境初始化 Google Cloud Storage
let storage;
if (process.env.NODE_ENV === 'production') {
  // 生產環境使用默認認證
  storage = new Storage({ projectId: process.env.GCP_PROJECT_ID });
  console.log("使用 Default IAM 認證");
} else {
  // 開發環境使用金鑰文件
  storage = new Storage({
    keyFilename: path.join(__dirname, process.env.GCP_KEY_FILENAME),
    projectId: process.env.GCP_PROJECT_ID
  });
  console.log("使用本地金鑰文件認證");
  console.log("GCP_KEY_FILENAME:", process.env.GCP_KEY_FILENAME);
  console.log("GCP_PROJECT_ID:", process.env.GCP_PROJECT_ID);
}

const bucketName = process.env.GCP_BUCKET_NAME;
if (!bucketName) {
  throw new Error('A bucket name is needed to use Cloud Storage.');
}

const bucket = storage.bucket(bucketName);

/**
 * 獲取簽名URL
 * @param {string} fileName - 文件名
 * @returns {Promise<string>} 文件的訪問 URL
 */
const getSignedUrl = async (fileName, mimeType = null) => {
  const contentType = mimeType || getMimeType(fileName);

  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天後過期
    contentType: contentType,
  }

  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options)

  return url;
}

/**
 * 上傳文件到 Google Cloud Storage
 * @param {Buffer} fileBuffer - 文件內容
 * @param {string} fileName - 文件名
 * @param {string} directory - 存儲目錄
 * @param {string} mimeType - 文件 MIME 類型
 * @returns {Promise<string>} 文件的訪問 URL
 */
const uploadToGCS = async (fileBuffer, fileName, directory = 'images', mimeType = null) => {
  try {
    // 確保目錄路徑正確
    const filePath = directory ? `${directory}/${fileName}` : fileName;
    const file = bucket.file(filePath);

    // 如果沒有提供 mimeType，則根據文件名判斷
    const contentType = mimeType || getMimeType(fileName);
    console.log("contentType:", contentType);

    // 創建寫入流
    const stream = file.createWriteStream({
      metadata: {
        contentType: contentType,
        cacheControl: 'public, max-age=31536000', // 快取一年
      },
      resumable: false
    });

    return new Promise((resolve, reject) => {
      // 錯誤處理
      stream.on('error', (error) => {
        console.error('文件上傳錯誤:', error);
        reject(new Error(`文件上傳失敗: ${error.message}`));
      });

      // 上傳完成處理
      stream.on('finish', async () => {
        try {
          // 獲取簽名 URL
          const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天後過期
          });

          resolve(url);
        } catch (error) {
          console.error('獲取簽名URL錯誤:', error);
          reject(new Error(`獲取文件URL失敗: ${error.message}`));
        }
      });

      // 寫入文件內容
      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error('上傳到 GCS 失敗:', error);
    throw new Error(`上傳到 GCS 失敗: ${error.message}`);
  }
};

/**
 * 流式上傳文件到 Google Cloud Storage
 * @param {ReadableStream} fileStream - 文件的可讀流
 * @param {string} fileName - 文件名
 * @param {string} directory - 存儲目錄
 * @param {string} mimeType - 文件 MIME 類型
 * @returns {Promise<string>} 文件的訪問 URL
 */
const streamUploadToGCS = (fileStream, fileName, directory = 'images', mimeType = null) => {
  return new Promise((resolve, reject) => {
    const filePath = directory ? `${directory}/${fileName}` : fileName;
    const file = bucket.file(filePath);

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType || 'application/octet-stream',
        cacheControl: 'public, max-age=31536000', // 快取一年
      },
      resumable: false
    });

    fileStream.pipe(stream)
      .on('error', (error) => {
        console.error('流式文件上傳錯誤:', error);
        reject(new Error(`流式文件上傳失敗: ${error.message}`));
      })
      .on('finish', async () => {
        try {
          const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天後過期
          });
          resolve(url);
        } catch (error) {
          console.error('獲取簽名URL錯誤:', error);
          reject(new Error(`獲取文件URL失敗: ${error.message}`));
        }
      });
  });
};

/**
 * 從 Google Cloud Storage 獲取圖片的簽名URL
 * @param {string} fileName - 文件名
 * @param {string} directory - 目錄路徑（可選）
 * @returns {Promise<string>} - 返回文件的簽名URL
 */
const getFileFromGCS = async (fileName, directory = 'images') => {
  try {
    // 如果副檔名是 video，則使用 video 目錄
    if (isVideo(fileName)) {
      directory = 'videos';
    }

    const filePath = directory ? `${directory}/${fileName}` : fileName;
    const file = bucket.file(filePath);

    // 檢查文件是否存在
    const [exists] = await file.exists();
    if (!exists) {
      return null;
    }

    // 生成簽名URL
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // URL 有效期 7 天
    });

    return url;
  } catch (error) {
    console.error('獲取圖片URL失敗:', error);
    throw error;
  }
};

/**
 * 檢查文件是否為影片
 * @param {string} fileName - 文件名
 * @returns {boolean} 是否為影片
 */
const isVideo = (fileName) => {
  if (!fileName) {
    return false;
  }
  const ext = path.extname(fileName).toLowerCase();
  return ext === '.mp4' || ext === '.avi' || ext === '.mov' || ext === '.wmv' || ext === '.flv' || ext === '.webm';
}

/**
 * 檢查文件是否存在 GCS
 * @param {string} fileName - 文件名
 * @returns {boolean} 是否存在 GCS
 */
const isFileExistsInGCS = async (fileName, directory = 'images') => {
  if (isVideo(fileName)) {
    directory = 'videos';
  }
  const filePath = directory ? `${directory}/${fileName}` : fileName;
  const file = bucket.file(filePath);
  const [exists] = await file.exists();
  console.log('isFileExistsInGCS', exists);
  return exists;
}

/**
 * 刪除 Google Cloud Storage 中的圖片
 * @param {string} fileName - 文件名
 * @param {string} directory - 目錄路徑（可選）
 * @returns {Promise<void>}
 */
const deleteFileFromGCS = async (fileName, directory = 'images') => {
  try {
    const filePath = directory ? `${directory}/${fileName}` : fileName;
    const file = bucket.file(filePath);
    
    // 檢查文件是否存在
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('文件不存在');
    }

    // 刪除文件
    await file.delete();
  } catch (error) {
    console.error('刪除圖片失敗:', error);
    throw error;
  }
};

// 輔助函數：根據文件名獲取 MIME 類型
const getMimeType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    // 圖片類型
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    
    // 文檔類型
    '.pdf': 'application/pdf',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    // 影片類型
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
  };

  return mimeTypes[ext] || 'application/octet-stream';
};

module.exports = {
  uploadToGCS,
  getFileFromGCS,
  deleteFileFromGCS,
  streamUploadToGCS,
  getSignedUrl,
  getMimeType,
  isFileExistsInGCS
}; 
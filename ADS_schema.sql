-- 表單
CREATE TABLE forms (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '表單 ID',
    name VARCHAR(255) NOT NULL COMMENT '表單名稱',
    description TEXT COMMENT '表單描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間'
);

-- 表單申請
CREATE TABLE form_applications (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '表單申請 ID',
    form_id INT COMMENT '申請的表單 ID',
    user_id INT COMMENT '申請者的用戶 ID',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '申請狀態',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提交時間',
    FOREIGN KEY (form_id) REFERENCES forms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 休假申請
CREATE TABLE leave_forms (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '休假申請 ID',
    user_id INT COMMENT '申請者的用戶 ID',
    start_date DATE COMMENT '開始日期',
    end_date DATE COMMENT '結束日期',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '申請狀態',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 碳排登記
CREATE TABLE carbon_footprint_forms (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '碳排登記 ID',
    user_id INT COMMENT '登記者的用戶 ID',
    date DATE COMMENT '登記日期',
    carbon_footprint INT COMMENT '碳排量',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 設備申請
CREATE TABLE equipment_forms (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '設備申請 ID',
    user_id INT COMMENT '申請者的用戶 ID',
    equipment_id INT COMMENT '申請的設備 ID',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '申請狀態',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

-- 設備
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '設備 ID',
    name VARCHAR(255) NOT NULL COMMENT '設備名稱',
    description TEXT COMMENT '設備描述',
    file_id INT COMMENT '檔案 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (file_id) REFERENCES files(id)
);

-- 其他連結
CREATE TABLE links (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '連結 ID',
    name VARCHAR(255) NOT NULL COMMENT '連結名稱',
    url VARCHAR(255) NOT NULL COMMENT '連結 URL',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否啟用',
    file_id INT COMMENT '檔案 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (file_id) REFERENCES files(id)
);

-- 懸賞任務
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '任務 ID',
    name VARCHAR(255) NOT NULL COMMENT '任務名稱',
    description TEXT COMMENT '任務描述',
    reward_type ENUM('moon_coin', 'star_point') COMMENT '獎勵類型',
    reward_amount INT COMMENT '獎勵數量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間'
);

-- 任務申請
CREATE TABLE task_applications (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '任務申請 ID',
    task_id INT COMMENT '申請的任務 ID',
    user_id INT COMMENT '申請者的用戶 ID',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '申請狀態',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申請時間',
    reviewed_at TIMESTAMP COMMENT '審核時間',
    reviewed_by INT COMMENT '審核者',
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 獎勵
CREATE TABLE rewards (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '獎勵 ID',
    name VARCHAR(255) NOT NULL COMMENT '獎勵名稱',
    description TEXT COMMENT '獎勵描述',
    cost INT COMMENT '獎勵成本',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間'
);

-- 獎勵兌換
CREATE TABLE reward_redemptions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '獎勵兌換 ID',
    reward_id INT COMMENT '兌換的獎勵 ID',
    user_id INT COMMENT '兌換者的用戶 ID',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '兌換狀態',
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '兌換時間',
    reviewed_at TIMESTAMP COMMENT '審核時間',
    reviewed_by INT COMMENT '審核者',
    FOREIGN KEY (reward_id) REFERENCES rewards(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 員工管理
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '員工 ID',
    name VARCHAR(255) NOT NULL COMMENT '員工姓名',
    position VARCHAR(255) COMMENT '職位',
    department VARCHAR(255) COMMENT '部門',
    file_id INT COMMENT '檔案 ID',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '員工狀態',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (file_id) REFERENCES files(id)
);

-- 公告管理
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '公告 ID',
    title VARCHAR(255) NOT NULL COMMENT '公告標題',
    content TEXT COMMENT '公告內容',
    file_id INT COMMENT '檔案 ID',
    type ENUM('general', 'performance') COMMENT '公告類型',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否啟用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (file_id) REFERENCES files(id)
);

-- 數據統計
CREATE TABLE statistics (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '統計 ID',
    user_id INT COMMENT '用戶 ID',
    moon_coins INT COMMENT '月亮幣數量',
    star_points INT COMMENT '小星點數量',
    quarter INT COMMENT '季度',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 檔案上傳
CREATE TABLE files (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '檔案 ID',
    filename VARCHAR(255) NOT NULL COMMENT '檔案名稱',
    original_filename VARCHAR(255) NOT NULL COMMENT '原始檔案名稱',
    mime_type VARCHAR(255) NOT NULL COMMENT '檔案類型',
    size INT COMMENT '檔案大小',
    uploaded_by INT COMMENT '上傳者的用戶 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
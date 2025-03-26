'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 創建 users 表
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '員工 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '員工姓名'
      },
      position: {
        type: Sequelize.STRING(255),
        comment: '職位'
      },
      department: {
        type: Sequelize.STRING(255),
        comment: '部門'
      },
      file_id: {
        type: Sequelize.INTEGER,
        comment: '檔案 ID'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        comment: '員工狀態'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 equipment 表
    await queryInterface.createTable('equipment', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '設備 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '設備名稱'
      },
      description: {
        type: Sequelize.TEXT,
        comment: '設備描述'
      },
      file_id: {
        type: Sequelize.INTEGER,
        comment: '檔案 ID'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 files 表
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '檔案 ID'
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '檔案名稱'
      },
      original_filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '原始檔案名稱'
      },
      mime_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '檔案類型'
      },
      size: {
        type: Sequelize.INTEGER,
        comment: '檔案大小'
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        comment: '上傳者的用戶 ID'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 forms 表
    await queryInterface.createTable('forms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '表單 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '表單名稱'
      },
      description: {
        type: Sequelize.TEXT,
        comment: '表單描述'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 form_applications 表
    await queryInterface.createTable('form_applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '表單申請 ID'
      },
      form_id: {
        type: Sequelize.INTEGER,
        comment: '申請的表單 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '申請者的用戶 ID'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: '申請狀態'
      },
      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '提交時間'
      }
    });

    // 創建 leave_forms 表
    await queryInterface.createTable('leave_forms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '休假申請 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '申請者的用戶 ID'
      },
      start_date: {
        type: Sequelize.DATE,
        comment: '開始日期'
      },
      end_date: {
        type: Sequelize.DATE,
        comment: '結束日期'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: '申請狀態'
      }
    });

    // 創建 carbon_footprint_forms 表
    await queryInterface.createTable('carbon_footprint_forms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '碳排登記 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '登記者的用戶 ID'
      },
      date: {
        type: Sequelize.DATE,
        comment: '登記日期'
      },
      carbon_footprint: {
        type: Sequelize.INTEGER,
        comment: '碳排量'
      }
    });

    // 創建 equipment_forms 表
    await queryInterface.createTable('equipment_forms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '設備申請 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '申請者的用戶 ID'
      },
      equipment_id: {
        type: Sequelize.INTEGER,
        comment: '申請的設備 ID'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: '申請狀態'
      }
    });

    // 創建 links 表
    await queryInterface.createTable('links', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '連結 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '連結名稱'
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '連結 URL'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: '是否啟用'
      },
      file_id: {
        type: Sequelize.INTEGER,
        comment: '檔案 ID'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 tasks 表
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '任務 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '任務名稱'
      },
      description: {
        type: Sequelize.TEXT,
        comment: '任務描述'
      },
      reward_type: {
        type: Sequelize.ENUM('moon_coin', 'star_point'),
        comment: '獎勵類型'
      },
      reward_amount: {
        type: Sequelize.INTEGER,
        comment: '獎勵數量'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 task_applications 表
    await queryInterface.createTable('task_applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '任務申請 ID'
      },
      task_id: {
        type: Sequelize.INTEGER,
        comment: '申請的任務 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '申請者的用戶 ID'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: '申請狀態'
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '申請時間'
      },
      reviewed_at: {
        type: Sequelize.DATE,
        comment: '審核時間'
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        comment: '審核者'
      }
    });

    // 創建 rewards 表
    await queryInterface.createTable('rewards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '獎勵 ID'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '獎勵名稱'
      },
      description: {
        type: Sequelize.TEXT,
        comment: '獎勵描述'
      },
      cost: {
        type: Sequelize.INTEGER,
        comment: '獎勵成本'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 reward_redemptions 表
    await queryInterface.createTable('reward_redemptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '獎勵兌換 ID'
      },
      reward_id: {
        type: Sequelize.INTEGER,
        comment: '兌換的獎勵 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '兌換者的用戶 ID'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        comment: '兌換狀態'
      },
      redeemed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '兌換時間'
      },
      reviewed_at: {
        type: Sequelize.DATE,
        comment: '審核時間'
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        comment: '審核者'
      }
    });

    // 創建 announcements 表
    await queryInterface.createTable('announcements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '公告 ID'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '公告標題'
      },
      content: {
        type: Sequelize.TEXT,
        comment: '公告內容'
      },
      file_id: {
        type: Sequelize.INTEGER,
        comment: '檔案 ID'
      },
      type: {
        type: Sequelize.ENUM('general', 'performance'),
        comment: '公告類型'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: '是否啟用'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });

    // 創建 statistics 表
    await queryInterface.createTable('statistics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '統計 ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        comment: '用戶 ID'
      },
      moon_coins: {
        type: Sequelize.INTEGER,
        comment: '月亮幣數量'
      },
      star_points: {
        type: Sequelize.INTEGER,
        comment: '小星點數量'
      },
      quarter: {
        type: Sequelize.INTEGER,
        comment: '季度'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '創建時間'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // 刪除所有表，順序與創建相反
    await queryInterface.dropTable('statistics');
    await queryInterface.dropTable('announcements');
    await queryInterface.dropTable('reward_redemptions');
    await queryInterface.dropTable('rewards');
    await queryInterface.dropTable('task_applications');
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('links');
    await queryInterface.dropTable('equipment_forms');
    await queryInterface.dropTable('carbon_footprint_forms');
    await queryInterface.dropTable('leave_forms');
    await queryInterface.dropTable('form_applications');
    await queryInterface.dropTable('forms');
    await queryInterface.dropTable('files');
    await queryInterface.dropTable('equipment');
    await queryInterface.dropTable('users');
  }
};

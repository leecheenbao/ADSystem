## 前台 API

1. **表單申請 API**
   - `GET` `/api/forms` 獲取所有可用表單的列表
   - `POST` `/api/forms/apply` 提交表單申請

2. **其他連結 API**
   - `GET` `/api/links` 獲取所有外部連結的列表

3. **懸賞任務 API**
   - `GET` `/api/tasks` 獲取所有可參與的任務
   - `GET` `/api/tasks/{category}` 依照種類獲取任務列表, 月亮幣、小星點、新手村、已結束任務
   - `POST` `/api/tasks-apply` 申請參加某個任務

4. **獎勵 API**
   - `GET` `/api/rewards` 獲取可兌換的獎勵列表
   - `POST` `/api/rewards/redeem` 申請兌換獎勵

5. **艦隊活動 API**
   - `GET` `/api/events` 獲取所有活動的列表

6. **元老院 API**
   - `GET` `/api/rules` 獲取系統運行規則
   - `GET` `/api/contracts` 獲取勞動契約信息

## 後台 API

1. **員工管理 API**
   - `GET` `/api/employees` 獲取所有員工的列表
   - `POST` `/api/employees` 新增員工
   - `PUT` `/api/employees/{id}` 編輯員工信息
   - `DELETE` `/api/employees/{id}` 軟刪除員工

2. **任務管理 API**
   - `GET` `/api/admin/tasks` 獲取所有任務列表
   - `POST` `/api/admin/tasks` 新增任務
   - `PUT` `/api/admin/tasks/{id}` 編輯任務
   - `DELETE` `/api/admin/tasks/{id}` 軟刪除任務

3. **任務申請審核 API**
   - `GET` `/api/admin/task-applications` 獲取所有任務申請
   - `PUT` `/api/admin/task-applications/{id}/approve` 審核通過申請
   - `PUT` `/api/admin/task-applications/{id}/reject` 駁回申請

4. **獎勵管理 API**
   - `GET` `/api/admin/rewards` 獲取所有獎勵項目
   - `POST` `/api/admin/rewards` 新增獎勵項目
   - `PUT` `/api/admin/rewards/{id}` 編輯獎勵項目
   - `DELETE` `/api/admin/rewards/{id}` 軟刪除獎勵項目

5. **數據統計 API**
   - `GET` `/api/admin/statistics` 獲取小星點及月亮幣的統計數據

6. **公告管理 API**
   - `GET` `/api/admin/announcements` 獲取所有公告
   - `POST` `/api/admin/announcements` 新增公告
   - `PUT` `/api/admin/announcements/{id}` 編輯公告
   - `DELETE` `/api/admin/announcements/{id}` 軟刪除公告
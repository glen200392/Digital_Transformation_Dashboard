# 🎯 下一步操作指南

## ✅ 已完成

- ✅ Supabase URL 已配置
- ✅ Supabase Anon Key 已配置
- ✅ 本地環境變數已設置（`.env` 文件）
- ✅ 專案構建測試成功

---

## 🚀 立即執行（3個步驟）

### 步驟 1️⃣：建立資料庫表格（5分鐘）

**重要**：這是最關鍵的一步！

1. **開啟 Supabase SQL Editor**

   直接訪問：https://app.supabase.com/project/ikjcwyjlscrjiohzqqgl/sql/new

2. **複製完整的 Schema**

   檔案位置：`frontend/supabase/schema.sql`（867行）

3. **貼上並執行**

   - 將整個檔案內容貼入 SQL Editor
   - 點擊右下角綠色的 **Run** 按鈕
   - 等待執行完成（約10-15秒）
   - ✅ 應該看到 "Success. No rows returned" 訊息

4. **驗證表格已建立**

   點擊左側選單 **Table Editor**，確認看到：

   ✅ users
   ✅ projects
   ✅ phases
   ✅ tasks
   ✅ subtasks
   ✅ risks
   ✅ alerts
   ✅ notifications
   ✅ ai_providers
   ✅ ai_usage_logs
   ✅ audit_logs
   ✅ comments
   ✅ attachments

   **總共 13 個表格**

---

### 步驟 2️⃣：啟動本地開發（1分鐘）

```bash
# 在專案目錄執行
cd frontend
npm run dev
```

您應該會看到：
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**開啟瀏覽器訪問**：http://localhost:5173

您應該會看到數位轉型儀表板的登入/首頁！

---

### 步驟 3️⃣：部署到 Vercel（5分鐘）

#### 方法 A：使用 Vercel CLI（最快）

```bash
# 安裝 Vercel CLI（如果還沒安裝）
npm install -g vercel

# 登入
vercel login

# 部署（從 frontend 目錄）
cd frontend
vercel

# 設置環境變數
vercel env add VITE_SUPABASE_URL production
# 貼上：https://ikjcwyjlscrjiohzqqgl.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# 貼上您的 anon key

# 部署到生產環境
vercel --prod
```

#### 方法 B：使用 Vercel Dashboard

1. 訪問：https://vercel.com/new

2. **Import Git Repository**
   - 選擇：`glen200392/Digital_Transformation_Dashboard`
   - 點擊 **Import**

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**（重要！）
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**

   添加以下變數：

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://ikjcwyjlscrjiohzqqgl.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `您的完整anon key` |

5. **Deploy**
   - 點擊 **Deploy**
   - 等待構建完成（約2分鐘）

6. **訪問您的應用**
   - Vercel 會提供一個 URL：`https://your-project.vercel.app`

---

## 🧪 測試與驗證

### 測試 1：本地連接測試

啟動開發伺服器後，打開瀏覽器控制台（F12），執行：

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// 應該顯示：https://ikjcwyjlscrjiohzqqgl.supabase.co
```

### 測試 2：建立測試用戶

在 Supabase Dashboard：

1. **Authentication** → **Users**
2. 點擊 **Add user** → **Create new user**
3. 填寫：
   - Email: `admin@test.com`
   - Password: `Admin123456!`
   - Auto Confirm User: ✅ 勾選
4. 點擊 **Create user**

5. **將用戶加入 users 表**

   在 SQL Editor 執行：

   ```sql
   INSERT INTO public.users (id, email, name, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
     'admin@test.com',
     'Admin User',
     'admin'
   );
   ```

### 測試 3：建立測試專案

在 SQL Editor 執行：

```sql
INSERT INTO public.projects (
  name,
  description,
  status,
  priority,
  category,
  start_date,
  owner,
  created_by,
  updated_by
)
VALUES (
  'AI工具推廣專案',
  '推廣AI工具在企業內部的應用',
  'in_progress',
  'high',
  'ai_tools',
  CURRENT_DATE,
  (SELECT id FROM public.users WHERE email = 'admin@test.com'),
  (SELECT id FROM public.users WHERE email = 'admin@test.com'),
  (SELECT id FROM public.users WHERE email = 'admin@test.com')
);

-- 查看結果
SELECT * FROM public.projects;
```

### 測試 4：訪問應用

1. 訪問 http://localhost:5173（本地）或您的 Vercel URL
2. 查看儀表板
3. 點擊「專案管理」
4. 應該會看到「AI工具推廣專案」

---

## ✅ 完成檢查清單

完成後，請確認：

### 本地開發
- [ ] 資料庫 Schema 已執行（13個表格）
- [ ] `npm run dev` 成功啟動
- [ ] 可以訪問 http://localhost:5173
- [ ] 瀏覽器控制台無錯誤

### Vercel 部署
- [ ] 專案已導入到 Vercel
- [ ] Root Directory 設為 `frontend`
- [ ] 環境變數已設置（2個）
- [ ] 構建成功（綠色勾選）
- [ ] 可以訪問生產 URL

### 測試數據
- [ ] 測試用戶已建立
- [ ] 測試專案已建立
- [ ] 可以在應用中看到測試數據

---

## 🎨 下一步自定義（選擇性）

完成基本設置後，您可以：

### 1. 新增更多測試數據

```sql
-- 新增更多專案
INSERT INTO public.projects (name, description, status, priority, category, start_date, owner, created_by, updated_by)
VALUES
  ('HR系統整合', 'HR系統與數位轉型平台整合', 'in_progress', 'medium', 'hr_collab', CURRENT_DATE,
   (SELECT id FROM public.users LIMIT 1),
   (SELECT id FROM public.users LIMIT 1),
   (SELECT id FROM public.users LIMIT 1)),
  ('AI治理框架', '建立企業AI使用治理框架', 'planning', 'critical', 'ai_governance', CURRENT_DATE,
   (SELECT id FROM public.users LIMIT 1),
   (SELECT id FROM public.users LIMIT 1),
   (SELECT id FROM public.users LIMIT 1));
```

### 2. 自定義主題

編輯 `frontend/src/App.tsx`：

```typescript
token: {
  colorPrimary: '#1890ff', // 主色調
  borderRadius: 6,         // 圓角
  fontSize: 14,            // 字體大小
}
```

### 3. 修改應用名稱

編輯 `frontend/.env`：

```env
VITE_APP_NAME=您的公司名稱 - 數位轉型平台
```

---

## 📚 重要文檔

- **快速參考**: `QUICK_START.md`
- **詳細設置**: `SETUP_GUIDE.md`
- **專案總結**: `PROJECT_SUMMARY.md`
- **開發指南**: `frontend/README.md`

---

## 🆘 遇到問題？

### 常見問題速查

| 問題 | 解決方案 |
|------|---------|
| **SQL 執行錯誤** | 確認完整複製 schema.sql 的所有內容 |
| **表格未顯示** | 刷新 Supabase Dashboard 頁面 |
| **連接失敗** | 檢查 .env 中的 URL 和 Key |
| **構建失敗** | 確認在 `frontend` 目錄執行 |
| **Vercel 404** | 確認 Root Directory 設為 `frontend` |

### 詳細疑難排解

查看 `SETUP_GUIDE.md` 的 **常見問題排除** 區塊

---

## 🎉 完成後

恭喜！您已經成功建立了企業級的數位轉型管理平台！

**接下來可以：**
- 🎨 自定義界面和主題
- 📊 新增更多專案和任務
- 🤖 配置 AI 功能
- 👥 邀請團隊成員
- 📈 開始追蹤專案進度

**專案已經完全可用！** 🚀

---

**需要幫助？** 隨時查看文檔或回報問題！

**GitHub**: https://github.com/glen200392/Digital_Transformation_Dashboard
**分支**: `claude/digital-transformation-dashboard-utmek`

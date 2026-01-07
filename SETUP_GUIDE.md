# 🚀 完整設置指南

## 目錄
1. [Supabase 設置](#1️⃣-supabase-設置)
2. [本地環境配置](#2️⃣-本地環境配置)
3. [Vercel 部署](#3️⃣-vercel-部署)
4. [驗證與測試](#4️⃣-驗證與測試)

---

## 1️⃣ Supabase 設置

### 步驟 1：取得 Supabase 憑證

1. 登入您的 [Supabase Dashboard](https://app.supabase.com)

2. 選擇您的專案

3. 點擊左側選單 **Settings** → **API**

4. 複製以下資訊：
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 步驟 2：執行資料庫 Schema

1. 在 Supabase Dashboard，點擊左側選單 **SQL Editor**

2. 點擊 **New Query**

3. 複製貼上 `frontend/supabase/schema.sql` 的完整內容

4. 點擊 **Run** 執行

5. 確認所有表格已建立（應該看到綠色的成功訊息）

### 步驟 3：驗證資料庫

1. 點擊左側選單 **Table Editor**

2. 確認以下表格已建立：
   - ✅ users
   - ✅ projects
   - ✅ phases
   - ✅ tasks
   - ✅ subtasks
   - ✅ risks
   - ✅ alerts
   - ✅ notifications
   - ✅ ai_providers
   - ✅ ai_usage_logs
   - ✅ audit_logs
   - ✅ comments
   - ✅ attachments

### 步驟 4：配置儲存桶（可選）

如果需要上傳檔案功能：

1. 點擊左側選單 **Storage**
2. 點擊 **Create a new bucket**
3. 名稱：`attachments`
4. 設定為 **Public** 或 **Private**（根據需求）
5. 點擊 **Create bucket**

---

## 2️⃣ 本地環境配置

### 步驟 1：配置環境變數

1. 進入專案目錄：
   ```bash
   cd frontend
   ```

2. 複製環境變數範例檔案：
   ```bash
   cp .env.example .env
   ```

3. 編輯 `.env` 檔案，填入您的 Supabase 憑證：
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Application Configuration
   VITE_APP_NAME=Digital Transformation Dashboard
   VITE_APP_VERSION=3.0.0

   # Feature Flags
   VITE_ENABLE_AI_FEATURES=false
   VITE_ENABLE_EMAIL_NOTIFICATIONS=true
   VITE_ENABLE_AUDIT_LOG=true

   # Environment
   VITE_ENV=development
   ```

### 步驟 2：安裝依賴

```bash
npm install
```

### 步驟 3：啟動開發伺服器

```bash
npm run dev
```

應該會看到：
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 步驟 4：訪問應用

開啟瀏覽器訪問：`http://localhost:5173`

您應該會看到儀表板登入畫面。

---

## 3️⃣ Vercel 部署

### 方法 A：使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **從專案根目錄部署**
   ```bash
   cd frontend
   vercel
   ```

4. **設置環境變數**
   ```bash
   # 設置生產環境變數
   vercel env add VITE_SUPABASE_URL production
   # 貼上您的 Supabase URL

   vercel env add VITE_SUPABASE_ANON_KEY production
   # 貼上您的 Supabase Anon Key
   ```

5. **部署到生產環境**
   ```bash
   vercel --prod
   ```

### 方法 B：使用 Vercel Dashboard

1. **匯入專案**
   - 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 **Add New...** → **Project**
   - 選擇您的 GitHub 倉庫：`Digital_Transformation_Dashboard`
   - 點擊 **Import**

2. **配置專案**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **設置環境變數**

   在 **Environment Variables** 區塊添加：

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
   | `VITE_APP_NAME` | `Digital Transformation Dashboard` |
   | `VITE_APP_VERSION` | `3.0.0` |

4. **部署**
   - 點擊 **Deploy**
   - 等待構建完成（約 1-2 分鐘）

5. **訪問您的應用**
   - 部署成功後，Vercel 會提供一個 URL：
   - `https://your-project.vercel.app`

---

## 4️⃣ 驗證與測試

### ✅ 檢查清單

#### 本地開發
- [ ] 專案啟動成功（`npm run dev`）
- [ ] 沒有 TypeScript 錯誤
- [ ] 可以訪問 http://localhost:5173
- [ ] 控制台沒有 Supabase 連接錯誤

#### Supabase
- [ ] 13 個表格已建立
- [ ] RLS 政策已啟用
- [ ] 索引已建立
- [ ] 觸發器已建立

#### Vercel 部署
- [ ] 構建成功（綠色勾選）
- [ ] 可以訪問生產 URL
- [ ] 環境變數已設置
- [ ] 沒有 404 錯誤

### 🧪 功能測試

#### 1. 測試 Supabase 連接

打開瀏覽器控制台（F12），在 Console 執行：

```javascript
// 應該看到連接成功的訊息
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

#### 2. 測試資料庫讀取

在 Supabase Dashboard → SQL Editor 執行：

```sql
-- 檢查表格數量
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';
-- 應該返回 13

-- 檢查 RLS 狀態
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- 所有表格的 rowsecurity 應該都是 true
```

#### 3. 建立測試用戶

1. 在 Supabase Dashboard → **Authentication** → **Users**
2. 點擊 **Add user** → **Create new user**
3. 填寫：
   - Email: `test@example.com`
   - Password: `Test123456!`
   - Auto Confirm User: ✅ 勾選
4. 點擊 **Create user**

5. 在 SQL Editor 執行，將用戶加入 users 表：
```sql
INSERT INTO public.users (id, email, name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test User',
  'pm'
);
```

#### 4. 建立測試專案

在 SQL Editor 執行：

```sql
-- 建立測試專案
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
  '測試專案',
  '這是一個測試專案',
  'in_progress',
  'high',
  'pm_mgmt',
  CURRENT_DATE,
  (SELECT id FROM public.users WHERE email = 'test@example.com'),
  (SELECT id FROM public.users WHERE email = 'test@example.com'),
  (SELECT id FROM public.users WHERE email = 'test@example.com')
);

-- 查詢結果
SELECT * FROM public.projects;
```

#### 5. 測試應用功能

1. 訪問您的應用（本地或 Vercel）
2. 使用測試帳號登入：`test@example.com` / `Test123456!`
3. 測試以下功能：
   - ✅ 儀表板顯示
   - ✅ 專案列表（應該看到測試專案）
   - ✅ 專案詳情
   - ✅ 預警中心
   - ✅ AI 治理頁面
   - ✅ 設定頁面

---

## 🔧 常見問題排除

### 問題 1：Supabase 連接失敗

**症狀**：
```
Error: Invalid Supabase URL or API key
```

**解決方案**：
1. 檢查 `.env` 檔案中的 URL 和 API Key
2. 確認沒有多餘的空格或換行
3. 重新啟動開發伺服器：`npm run dev`

### 問題 2：RLS 阻止讀取數據

**症狀**：
```
Error: new row violates row-level security policy
```

**解決方案**：
1. 確認已登入（有 auth.uid()）
2. 檢查 RLS 政策是否正確
3. 暫時測試：在 Supabase Dashboard 關閉特定表格的 RLS

### 問題 3：Vercel 構建失敗

**症狀**：
```
Error: Build failed
```

**解決方案**：
1. 檢查本地構建：`npm run build`
2. 確認環境變數已在 Vercel 設置
3. 查看 Vercel 構建日誌
4. 確認 Root Directory 設置為 `frontend`

### 問題 4：環境變數未生效

**症狀**：
```
undefined
```

**解決方案**：
1. 環境變數必須以 `VITE_` 開頭
2. 修改 `.env` 後需重新啟動開發伺服器
3. Vercel 環境變數修改後需重新部署

---

## 📚 下一步

完成設置後，您可以：

1. **開發新功能**
   - 參考 `PROJECT_SUMMARY.md` 了解待實現功能
   - 查看 `frontend/src/types/index.ts` 了解資料結構

2. **自定義配置**
   - 修改 `frontend/src/App.tsx` 調整主題
   - 編輯 `frontend/vercel.json` 調整部署設置

3. **添加測試**
   - 執行：`npm run test`
   - 查看覆蓋率：`npm run test:coverage`

4. **部署更新**
   - 推送到 GitHub 會自動觸發 Vercel 部署
   - 或手動執行：`vercel --prod`

---

## 🆘 需要幫助？

- **文檔**：`frontend/README.md`
- **專案總結**：`PROJECT_SUMMARY.md`
- **GitHub Issues**：創建 Issue 回報問題
- **Supabase 文檔**：https://supabase.com/docs
- **Vercel 文檔**：https://vercel.com/docs

---

**完成設置後，您的應用就可以上線了！🎉**

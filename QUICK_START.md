# ⚡ 快速開始清單

## 📋 您需要提供的資訊

### 1. Supabase 憑證（必需）

登入 [Supabase Dashboard](https://app.supabase.com) → Settings → API

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**在哪裡使用？**
- 本地開發：填入 `frontend/.env`
- Vercel 部署：在 Vercel Dashboard 設置環境變數

---

## 🚀 三步驟啟動

### 步驟 1：設置 Supabase 數據庫

1. 開啟 [Supabase Dashboard](https://app.supabase.com)
2. 點擊 **SQL Editor**
3. 複製 `frontend/supabase/schema.sql` 的內容
4. 貼上並點擊 **Run**
5. ✅ 確認 13 個表格已建立

### 步驟 2：本地開發

```bash
cd frontend
cp .env.example .env
# 編輯 .env，填入 Supabase 憑證
npm install
npm run dev
```

訪問：http://localhost:5173

### 步驟 3：部署到 Vercel

**方法 A - CLI（快速）**
```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

**方法 B - Dashboard**
1. 訪問 [Vercel Dashboard](https://vercel.com/new)
2. 匯入 GitHub 倉庫
3. Root Directory: `frontend`
4. 添加環境變數（同 .env）
5. 點擊 Deploy

---

## ✅ 驗證清單

- [ ] Supabase 數據庫已建立（13個表格）
- [ ] 本地開發伺服器運行成功
- [ ] 可以訪問 localhost:5173
- [ ] Vercel 部署成功
- [ ] 生產環境可以訪問

---

## 📚 詳細文檔

- **完整設置指南**：`SETUP_GUIDE.md`
- **專案總結**：`PROJECT_SUMMARY.md`
- **開發文檔**：`frontend/README.md`

---

## 🆘 遇到問題？

**常見問題：**
1. **連接錯誤** → 檢查 .env 中的 URL 和 API Key
2. **構建失敗** → 確認 `npm run build` 本地成功
3. **RLS 錯誤** → 確認數據庫 Schema 已正確執行

**需要幫助？** 查看 `SETUP_GUIDE.md` 的疑難排解區塊

---

**就這麼簡單！🎉**

# 部署指南

## 快速開始

### 步驟 1: 設定 Google Apps Script

1. 開啟您的 Google Sheet
2. 點擊 `擴充功能` > `Apps Script`
3. 刪除預設程式碼，貼上 `docs/google-apps-script-v2.js` 的完整內容
4. 確認第 23 行的 `SHEET_ID` 已設定為您的 Google Sheet ID

### 步驟 2: 部署為 Web App

1. 在 Apps Script 編輯器中，點擊 `部署` > `新增部署作業`
2. 選擇類型：`網頁應用程式`
3. 設定：
   - 說明：數位轉型儀表板 API v2.2.0
   - 執行身分：我
   - 存取權限：任何人
4. 點擊 `部署`
5. 複製產生的 Web App URL

### 步驟 3: 設定前端

1. 開啟 `js/config.js`
2. 找到 `api` 區塊，更新 `endpoint`：

```javascript
api: {
    endpoint: '貼上您的 Web App URL',
    // ...
}
```

### 步驟 4: 測試

1. 在瀏覽器開啟 `index.html`
2. 確認同步狀態顯示為 🟢 Google Sheet (即時)
3. 確認資料正確顯示

## API 端點

| Endpoint | 說明 |
|----------|------|
| `?endpoint=full` | 取得完整資料 |
| `?endpoint=kpi` | 取得 KPI |
| `?endpoint=health` | 健康檢查 |
| `?endpoint=validate` | 資料驗證 |

## 設定每日健康檢查

在 Apps Script 編輯器中執行 `setupDailyHealthCheck` 函數，系統將每天早上 9 點自動檢查資料品質並在發現問題時發送郵件通知。

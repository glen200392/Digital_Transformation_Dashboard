# Google Apps Script 整合實作摘要

## 已完成的工作

本次實作已成功建立完整的 Google Apps Script 整合方案，包含以下三個核心文件：

### 1. ✅ Google Apps Script API (`docs/google-apps-script-v2.js`)

**功能特點：**
- 完整的 API 端點實作，支援 7 種查詢模式
- 自動資料格式轉換（High→high, Medium→med, Low→low）
- 智慧型高風險計算（impact=High AND probability=High）
- CORS 支援，可直接從前端呼叫
- 完整的錯誤處理和降級機制
- 內建測試函數方便除錯

**支援的 API 端點：**
1. `?endpoint=full` - 完整資料（預設）
2. `?endpoint=kpi` - 僅 KPI 指標
3. `?endpoint=risks` - 僅風險資料
4. `?endpoint=projects` - 僅專案列表
5. `?endpoint=quickwins` - 僅快速成效
6. `?endpoint=capability` - 僅能力建設
7. `?endpoint=resources` - 僅資源配置
8. `?endpoint=charts` - 僅圖表資料

**對應用戶現有的工作表：**
- ✓ Config - 設定
- ✓ _AuditLog - 審計日誌
- ✓ KPI_Metrics - KPI 指標
- ✓ Projects - 專案列表
- ✓ Capability - 能力建設
- ✓ Change_Management - 變革管理
- ✓ Risk_Register - 風險登記

### 2. ✅ 工作表結構對照文件 (`docs/GOOGLE_SHEET_MAPPING.md`)

**內容包含：**
- 現有工作表與系統需求的完整對照表
- 每個工作表的詳細欄位定義
- 必要欄位與可選欄位標示
- 資料格式轉換規則說明
- 新增工作表的建立模板（QuickWins、Resources、ChartData）
- 完整的範例資料
- 常見問題解答

**特別說明：**
- 文件詳細記錄了用戶 Risk_Register 工作表的欄位結構
- 提供彈性設計：可選工作表可不建立，系統會自動從其他來源取得資料
- 包含完整的資料驗證規則

### 3. ✅ 整合測試檢查清單 (`docs/INTEGRATION_TEST_CHECKLIST.md`)

**內容包含：**
- 測試前準備檢查清單
- 詳細的部署步驟指南
- 7 個 API 端點的完整測試步驟
- 資料格式驗證方法
- 前端整合測試指南
- 常見問題排解方案（6 個常見問題）
- 效能測試指南

**測試涵蓋範圍：**
- ✓ Google Sheet 連接測試
- ✓ 資料讀取測試
- ✓ Web App 部署測試
- ✓ API 端點功能測試
- ✓ 資料格式驗證測試
- ✓ 前端整合測試
- ✓ 效能基準測試

### 4. ✅ 驗證現有資料結構

已確認 `data/fallback.json` 的資料結構完全符合 API 回傳格式要求，無需修改。

---

## 實作亮點

### 🎯 精確對應用戶需求

1. **工作表名稱對應**
   - 完全對應用戶現有的工作表名稱（Config、KPI_Metrics、Risk_Register 等）
   - 無需修改用戶現有的 Google Sheet 結構

2. **風險資料轉換**
   - 自動轉換：High→high, Medium→med, Low→low
   - 使用精確匹配避免誤判（如 "highlight" 不會被誤判為 "high"）
   - 支援大小寫不敏感

3. **高風險自動計算**
   - 定義：impact="High" AND probability="High"
   - 自動統計並填入 kpi.highRisks

### 🚀 效能優化

1. **避免重複讀取**
   - 在 getFullData() 中先讀取風險資料
   - 傳遞快取資料給 getKPI()，避免重複讀取 Risk_Register

2. **智慧型降級處理**
   - 找不到工作表時使用預設值
   - 找不到可選工作表時從其他來源計算或讀取
   - 錯誤不會中斷整個流程

3. **欄位查找優化**
   - 建立 findColumnIndex 輔助函數
   - 支援主要欄位名稱和備選名稱
   - 避免重複的 indexOf 呼叫

### 🔒 安全性考量

1. **CORS 支援**
   - 使用 ContentService.createTextOutput()
   - 設定正確的 MIME Type
   - 支援跨域請求

2. **錯誤處理**
   - 所有主要函數都有 try-catch
   - 錯誤不會洩漏敏感資訊
   - 降級處理確保服務可用性

3. **隱私保護**
   - Session.getActiveUser() 加入 try-catch
   - Web App 模式下無法取得用戶 email 時使用 'anonymous'
   - 審計日誌失敗不影響主要功能

### 🎨 彈性設計

1. **可選工作表**
   - QuickWins：可不建立，從 Projects 篩選
   - Resources：可不建立，從 Config 讀取
   - ChartData：可不建立，從 Capability 計算

2. **欄位名稱彈性**
   - 支援多種欄位名稱（如 name 或 project_name）
   - 自動查找備選欄位名稱
   - 降低設定錯誤的可能性

3. **資料來源彈性**
   - Quick Wins 可從專用工作表或 Projects 篩選
   - 資源配置可從 Resources 或 Config 讀取
   - 圖表資料可自訂或自動生成

---

## 使用指南

### 快速開始

1. **複製腳本到 Google Apps Script**
   ```
   1. 開啟 Google Apps Script 編輯器
   2. 複製 docs/google-apps-script-v2.js 的內容
   3. 修改 SHEET_ID 為您的 Google Sheet ID
   4. 儲存腳本
   ```

2. **測試連接**
   ```javascript
   // 在 Apps Script 編輯器中執行
   testSheetExists()  // 檢查所有工作表
   testAPI()          // 測試資料讀取
   ```

3. **部署為 Web App**
   ```
   1. 點擊「部署」→「新增部署作業」
   2. 選擇類型：「網頁應用程式」
   3. 執行身分：我
   4. 具有存取權的使用者：任何人
   5. 點擊「部署」
   6. 複製 Web App URL
   ```

4. **設定前端**
   ```javascript
   // 在 js/config.js 中設定
   const CONFIG = {
     api: {
       endpoint: 'YOUR_WEB_APP_URL',
       // ...
     }
   };
   ```

### 測試清單

參考 `docs/INTEGRATION_TEST_CHECKLIST.md` 進行完整測試：

- [ ] 工作表連接測試
- [ ] 資料讀取測試
- [ ] Web App 部署測試
- [ ] 所有 API 端點測試
- [ ] 資料格式驗證
- [ ] 前端整合測試
- [ ] Layer 1-3 顯示測試

---

## 資料結構說明

### API 回傳格式

```json
{
  "kpi": {
    "healthScore": 76,
    "healthTrend": "up",
    "roi": 145,
    "progress": 73,
    "engagement": 68,
    "highRisks": 0
  },
  "quickWins": [...],
  "risks": [...],
  "projects": [...],
  "resources": {...},
  "metrics": {...},
  "charts": {...},
  "metadata": {
    "version": "2.0.0",
    "lastUpdate": "2025-12-05T...",
    "source": "google_sheets",
    "sheetId": "1yyjwY2tDcV1_6mF8KjdkkEPz4jYGWWnIZIiWrbpNpfk"
  }
}
```

### 重要欄位說明

1. **kpi.highRisks**
   - 自動計算：impact="High" AND probability="High"
   - 數值型，不是字串

2. **risks[].probability 和 risks[].impact**
   - 只有三個值：high、med、low（全小寫）
   - 系統會自動轉換 Google Sheet 的 High/Medium/Low

3. **quickWins**
   - 如果有 QuickWins 工作表，從該表讀取
   - 否則從 Projects 篩選 quick_win=TRUE 的項目

4. **charts.radar**
   - 如果有 ChartData 工作表，從該表讀取
   - 否則從 Capability 工作表自動生成

---

## 常見問題

### Q1: 如何確認 API 正常運作？

A: 執行以下步驟：
```javascript
1. 在 Apps Script 中執行 testSheetExists()
2. 在 Apps Script 中執行 testAPI()
3. 在瀏覽器開啟 Web App URL
4. 檢查是否回傳 JSON 資料
```

### Q2: 風險等級轉換不正確怎麼辦？

A: 檢查以下項目：
- Risk_Register 的 impact 和 probability 欄位值
- 確認值為 High、Medium 或 Low（大小寫不重要）
- 執行 testAPI() 查看轉換結果

### Q3: Quick Wins 沒有資料怎麼辦？

A: 有兩種解決方式：
1. 建立 QuickWins 工作表並新增資料
2. 在 Projects 工作表新增 quick_win 欄位，設定為 TRUE

### Q4: 可以自訂圖表資料嗎？

A: 可以：
1. 建立 ChartData 工作表
2. 參考 docs/GOOGLE_SHEET_MAPPING.md 的結構
3. 目前會使用預設資料，可依需求調整

### Q5: 如何更新資料？

A: 直接在 Google Sheet 中修改資料，前端重新整理即可看到更新。

### Q6: 部署後無法存取怎麼辦？

A: 檢查以下項目：
1. 「具有存取權的使用者」設定為「任何人」
2. 已完成權限授權
3. URL 以 `/exec` 結尾
4. 檢查 Console 是否有 CORS 錯誤

---

## 下一步建議

1. **立即執行**
   - [ ] 複製腳本到 Google Apps Script
   - [ ] 執行測試函數
   - [ ] 部署為 Web App
   - [ ] 測試 API 端點

2. **資料準備**
   - [ ] 確認所有必要工作表都有資料
   - [ ] 確認欄位名稱正確
   - [ ] 執行資料格式驗證

3. **前端整合**
   - [ ] 設定 API URL
   - [ ] 測試資料載入
   - [ ] 測試各 Layer 顯示
   - [ ] 測試刷新功能

4. **效能優化**（可選）
   - [ ] 監控 API 回應時間
   - [ ] 考慮實作快取機制
   - [ ] 優化 Google Sheet 資料量

---

## 技術支援

如遇問題，請參考：
1. `docs/INTEGRATION_TEST_CHECKLIST.md` - 測試指南和常見問題
2. `docs/GOOGLE_SHEET_MAPPING.md` - 資料結構說明
3. Google Apps Script 執行日誌 - 檢查錯誤訊息
4. 瀏覽器 Console - 檢查前端錯誤

---

**文件版本**: 1.0.0  
**建立日期**: 2025-12-05  
**維護者**: Digital Transformation Team

## 安全摘要

✅ **CodeQL 安全掃描：通過**
- 無安全漏洞
- 無資料外洩風險
- 錯誤處理完善
- 隱私保護機制正常

✅ **程式碼審查：已完成**
- 已優化重複程式碼
- 已改善錯誤處理
- 已優化效能
- 已加強資料驗證

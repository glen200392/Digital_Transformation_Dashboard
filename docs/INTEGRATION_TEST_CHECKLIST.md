# Google Apps Script 整合測試檢查清單

本文件提供完整的測試步驟，協助您驗證 Google Apps Script API 是否正確整合。

## 目錄

- [測試前準備](#測試前準備)
- [部署步驟](#部署步驟)
- [API 端點測試](#api-端點測試)
- [資料格式驗證](#資料格式驗證)
- [前端整合測試](#前端整合測試)
- [常見問題排解](#常見問題排解)
- [效能測試](#效能測試)

---

## 測試前準備

### 1. Google Sheet 準備

- [ ] 確認 Google Sheet ID: `1yyjwY2tDcV1_6mF8KjdkkEPz4jYGWWnIZIiWrbpNpfk`
- [ ] 確認所有必要工作表都已建立：
  - [ ] Config
  - [ ] _AuditLog
  - [ ] KPI_Metrics
  - [ ] Projects
  - [ ] Capability
  - [ ] Change_Management
  - [ ] Risk_Register
- [ ] 確認可選工作表（如需要）：
  - [ ] QuickWins
  - [ ] Resources
  - [ ] ChartData
- [ ] 確認每個工作表的第一行都有正確的欄位名稱
- [ ] 確認至少有一行測試資料（除了 _AuditLog）

### 2. Google Apps Script 準備

- [ ] 已建立 Google Apps Script 專案
- [ ] 已複製 `docs/google-apps-script-v2.js` 的內容
- [ ] 已修改 `SHEET_ID` 為正確的 Google Sheet ID
- [ ] 已儲存腳本

### 3. 測試工具準備

- [ ] 瀏覽器（建議使用 Chrome）
- [ ] 文字編輯器（用於檢查 JSON）
- [ ] Postman 或類似的 API 測試工具（可選）

---

## 部署步驟

### Step 1: 在 Apps Script 編輯器中測試

#### 1.1 測試工作表連接

```javascript
// 在 Apps Script 編輯器中執行
testSheetExists()
```

**預期結果**：
```
=== 檢查工作表 ===
Config: ✓ 存在
_AuditLog: ✓ 存在
KPI_Metrics: ✓ 存在
Projects: ✓ 存在
Capability: ✓ 存在
Change_Management: ✓ 存在
Risk_Register: ✓ 存在
QuickWins: ✗ 不存在 (可選)
Resources: ✗ 不存在 (可選)
ChartData: ✗ 不存在 (可選)
=== 檢查完成 ===
```

- [ ] 所有必要工作表都顯示「✓ 存在」
- [ ] 如果有缺少的必要工作表，請回到 Google Sheet 建立

#### 1.2 測試資料讀取

```javascript
// 在 Apps Script 編輯器中執行
testAPI()
```

**預期結果**：
```
=== 測試 API ===

1. 測試 getKPI:
{
  "healthScore": 76,
  "healthTrend": "up",
  "roi": 145,
  "progress": 73,
  "engagement": 68,
  "highRisks": 0
}

2. 測試 getRisks:
[
  {
    "id": 1,
    "title": "預算超支風險",
    "probability": "low",
    "impact": "med",
    "status": "監控中",
    ...
  }
]

...

=== 測試完成 ===
高風險數量: 0
```

- [ ] 所有測試都成功執行
- [ ] 資料格式正確
- [ ] 風險等級已正確轉換（High → high, Medium → med, Low → low）
- [ ] 高風險數量計算正確

### Step 2: 部署為 Web App

#### 2.1 部署設定

1. 點擊「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - [ ] 說明：數位轉型儀表板 API v2.0
   - [ ] 執行身分：我（您的 Google 帳號）
   - [ ] 具有存取權的使用者：**任何人**
4. 點擊「部署」
5. 複製 Web App URL

**Web App URL 格式**：
```
https://script.google.com/macros/s/AKfycbz.../exec
```

- [ ] 已成功部署
- [ ] 已複製 Web App URL
- [ ] URL 以 `/exec` 結尾

#### 2.2 權限授權

首次部署時會要求授權：

1. 點擊「授權存取權」
2. 選擇您的 Google 帳號
3. 點擊「進階」
4. 點擊「前往『專案名稱』（不安全）」
5. 點擊「允許」

- [ ] 已完成授權
- [ ] 沒有看到錯誤訊息

---

## API 端點測試

### 測試 1: 完整資料端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=full
```

**測試方法**：
1. 在瀏覽器中開啟 URL
2. 或使用 curl：
```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=full"
```

**預期結果**：
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

**檢查項目**：
- [ ] HTTP 狀態碼為 200
- [ ] Content-Type 為 `application/json`
- [ ] 回應格式為有效的 JSON
- [ ] 包含所有必要的頂層欄位（kpi, quickWins, risks, projects, resources, metrics, charts, metadata）
- [ ] metadata.source 為 "google_sheets"
- [ ] metadata.version 為 "2.0.0"

### 測試 2: KPI 端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=kpi
```

**預期結果**：
```json
{
  "healthScore": 76,
  "healthTrend": "up",
  "roi": 145,
  "progress": 73,
  "engagement": 68,
  "highRisks": 0
}
```

**檢查項目**：
- [ ] healthScore 是數字（0-100）
- [ ] healthTrend 是 "up"、"down" 或 "stable"
- [ ] roi 是數字
- [ ] progress 是數字（0-100）
- [ ] engagement 是數字（0-100）
- [ ] highRisks 是數字（≥0）

### 測試 3: 風險端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=risks
```

**預期結果**：
```json
[
  {
    "id": 1,
    "title": "預算超支風險",
    "probability": "low",
    "impact": "med",
    "status": "監控中",
    "description": "...",
    "owner": "張三",
    "mitigation": "...",
    "dueDate": "2025-12-31"
  }
]
```

**檢查項目**：
- [ ] 回應是陣列
- [ ] 每個風險都有 id、title、probability、impact
- [ ] probability 只有 "high"、"med"、"low"（全小寫）
- [ ] impact 只有 "high"、"med"、"low"（全小寫）
- [ ] 日期格式為 "YYYY-MM-DD"

### 測試 4: 專案端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=projects
```

**預期結果**：
```json
[
  {
    "id": 1,
    "name": "核心系統現代化",
    "department": "IT",
    "status": "進行中",
    "progress": 65,
    "budget": "$500K",
    "timeline": "Q1-Q4 2025",
    "priority": "high"
  }
]
```

**檢查項目**：
- [ ] 回應是陣列
- [ ] 每個專案都有 name、department、status、progress、budget、timeline
- [ ] progress 是數字（0-100）

### 測試 5: Quick Wins 端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=quickwins
```

**預期結果**：
```json
[
  {
    "title": "自動化報表系統",
    "owner": "IT 部門",
    "deadline": "2025-12-15",
    "progress": 85
  }
]
```

**檢查項目**：
- [ ] 回應是陣列
- [ ] 每個項目都有 title、owner、deadline、progress
- [ ] 只包含標記為 Quick Win 的項目

### 測試 6: 資源端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=resources
```

**預期結果**：
```json
{
  "totalBudget": "$2.5M",
  "usedBudget": "$1.8M (72%)",
  "totalHeadcount": 45,
  "allocatedHeadcount": "38 (84%)"
}
```

**檢查項目**：
- [ ] 包含 totalBudget、usedBudget、totalHeadcount、allocatedHeadcount
- [ ] totalHeadcount 是數字

### 測試 7: 圖表資料端點

**URL**：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?endpoint=charts
```

**預期結果**：
```json
{
  "radar": {
    "labels": ["策略規劃", "流程優化", ...],
    "current": [75, 82, 68, 71, 79, 85],
    "target": [85, 90, 85, 85, 90, 90]
  },
  "burndown": {...},
  "funnel": {...},
  "adoption": {...}
}
```

**檢查項目**：
- [ ] 包含 radar、burndown、funnel、adoption
- [ ] radar.labels、radar.current、radar.target 長度相同
- [ ] 所有數值都是數字

---

## 資料格式驗證

### 驗證清單

使用以下 JavaScript 函數驗證資料格式：

```javascript
function validateFullData(data) {
  const errors = [];
  
  // 驗證 KPI
  if (!data.kpi) errors.push('缺少 kpi');
  if (data.kpi.healthScore < 0 || data.kpi.healthScore > 100) {
    errors.push('healthScore 必須在 0-100 之間');
  }
  if (!['up', 'down', 'stable'].includes(data.kpi.healthTrend)) {
    errors.push('healthTrend 必須是 up/down/stable');
  }
  
  // 驗證風險
  if (data.risks) {
    data.risks.forEach((risk, index) => {
      if (!['high', 'med', 'low'].includes(risk.probability)) {
        errors.push(`風險 ${index} 的 probability 格式錯誤`);
      }
      if (!['high', 'med', 'low'].includes(risk.impact)) {
        errors.push(`風險 ${index} 的 impact 格式錯誤`);
      }
    });
  }
  
  // 驗證專案進度
  if (data.projects) {
    data.projects.forEach((project, index) => {
      if (typeof project.progress !== 'number') {
        errors.push(`專案 ${index} 的 progress 必須是數字`);
      }
      if (project.progress < 0 || project.progress > 100) {
        errors.push(`專案 ${index} 的 progress 必須在 0-100 之間`);
      }
    });
  }
  
  return errors;
}
```

**執行驗證**：
```javascript
const response = await fetch('YOUR_API_URL?endpoint=full');
const data = await response.json();
const errors = validateFullData(data);

if (errors.length === 0) {
  console.log('✓ 資料格式驗證通過');
} else {
  console.error('✗ 資料格式驗證失敗：', errors);
}
```

**檢查項目**：
- [ ] 沒有驗證錯誤
- [ ] 所有數值型欄位都是數字，不是字串
- [ ] 所有百分比值不包含 % 符號
- [ ] 所有日期格式正確

---

## 前端整合測試

### Step 1: 設定 API URL

在前端 `js/config.js` 中設定：

```javascript
const CONFIG = {
  api: {
    endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    fallbackDataPath: 'data/fallback.json',
    timeout: 10000
  },
  // ... 其他設定
};
```

- [ ] 已更新 API endpoint URL
- [ ] URL 正確（以 /exec 結尾）

### Step 2: 測試前端載入

1. 開啟 `index.html` 或 `digital_transformation_dashboard.html`
2. 打開瀏覽器開發者工具（F12）
3. 切換到 Console 標籤

**檢查項目**：
- [ ] 沒有 CORS 錯誤
- [ ] 沒有 404 錯誤
- [ ] Console 顯示 `[App] 資料載入成功`
- [ ] KPI 卡片顯示正確的數值
- [ ] 沒有「使用離線備用資料」的警告

### Step 3: 測試各 Layer

#### Layer 1 - Executive Summary
- [ ] 健康度總分顯示正確
- [ ] 趨勢箭頭顯示正確（上/下/持平）
- [ ] ROI 顯示正確
- [ ] 整體進度顯示正確
- [ ] 員工參與度顯示正確
- [ ] 高風險項目數顯示正確

#### Layer 2 - Dashboard
- [ ] Quick Wins 列表顯示正確
- [ ] 風險熱力圖顯示正確
- [ ] 雷達圖顯示正確
- [ ] 燃盡圖顯示正確

#### Layer 3 - Details
- [ ] 專案列表顯示正確
- [ ] 資源配置卡片顯示正確
- [ ] 關鍵指標卡片顯示正確
- [ ] 漏斗圖顯示正確
- [ ] 採用曲線圖顯示正確

### Step 4: 測試資料刷新

1. 點擊刷新按鈕
2. 觀察 Console

**檢查項目**：
- [ ] 顯示「正在從伺服器載入資料...」
- [ ] 資料成功重新載入
- [ ] 最後刷新時間更新
- [ ] 沒有錯誤訊息

---

## 常見問題排解

### 問題 1: CORS 錯誤

**錯誤訊息**：
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**解決方法**：
1. 確認 Google Apps Script 已正確部署為 Web App
2. 確認「具有存取權的使用者」設定為「任何人」
3. 確認使用 `ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON)`

**檢查項目**：
- [ ] 已重新部署 Web App
- [ ] 已清除瀏覽器快取
- [ ] 已確認部署設定正確

### 問題 2: 資料格式錯誤

**錯誤訊息**：
```
資料驗證失敗
```

**解決方法**：
1. 檢查 Google Sheet 的欄位名稱是否正確
2. 檢查資料類型（數字不要用文字格式）
3. 檢查日期格式
4. 執行 `testAPI()` 函數檢查資料

**檢查項目**：
- [ ] 欄位名稱與文件一致
- [ ] 數值欄位使用數字格式
- [ ] 日期欄位使用日期格式
- [ ] 沒有空白行在資料中間

### 問題 3: 找不到工作表

**錯誤訊息**：
```
找不到 XXX 工作表
```

**解決方法**：
1. 確認工作表名稱完全一致（包括大小寫）
2. 確認 SHEET_ID 正確
3. 確認 Google 帳號有權限存取該 Sheet

**檢查項目**：
- [ ] 工作表名稱正確
- [ ] SHEET_ID 正確
- [ ] 已授權存取

### 問題 4: 高風險數量不正確

**問題描述**：
`kpi.highRisks` 數量與預期不符

**解決方法**：
1. 檢查 Risk_Register 工作表的資料
2. 確認 impact 和 probability 欄位的值
3. 高風險定義：impact="High" AND probability="High"

**檢查項目**：
- [ ] 確認有風險同時符合 impact=High 且 probability=High
- [ ] 確認大小寫正確（會自動轉換）
- [ ] 重新執行 `testAPI()` 檢查

### 問題 5: Quick Wins 沒有資料

**問題描述**：
`quickWins` 陣列為空

**解決方法**：
1. 確認有 QuickWins 工作表，或
2. 確認 Projects 工作表有 `quick_win` 欄位
3. 確認 `quick_win` 欄位的值為 TRUE/YES/1

**檢查項目**：
- [ ] QuickWins 工作表存在且有資料，或
- [ ] Projects 工作表有 quick_win 欄位
- [ ] quick_win 值正確設定

### 問題 6: 圖表不顯示

**問題描述**：
圖表區域空白或錯誤

**解決方法**：
1. 確認 Capability 工作表有資料
2. 確認 current 和 target 是數字
3. 打開 Console 檢查錯誤訊息

**檢查項目**：
- [ ] Capability 工作表有至少一行資料
- [ ] 數值欄位是數字格式
- [ ] Chart.js 庫已載入

---

## 效能測試

### 測試 API 回應時間

使用以下 JavaScript 測試回應時間：

```javascript
async function testPerformance() {
  const url = 'YOUR_API_URL?endpoint=full';
  const startTime = performance.now();
  
  const response = await fetch(url);
  const data = await response.json();
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`API 回應時間: ${duration.toFixed(2)}ms`);
  console.log(`資料大小: ${JSON.stringify(data).length} bytes`);
  
  return { duration, size: JSON.stringify(data).length };
}
```

**效能基準**：
- [ ] 回應時間 < 3000ms（正常）
- [ ] 回應時間 < 5000ms（可接受）
- [ ] 資料大小 < 100KB

**如果回應時間過長**：
1. 減少 Google Sheet 的資料量
2. 考慮使用快取機制
3. 檢查網路連線

---

## 測試完成檢查清單

### 部署階段
- [ ] Google Sheet 已建立且有測試資料
- [ ] Google Apps Script 已部署為 Web App
- [ ] 已完成權限授權
- [ ] 已取得 Web App URL

### API 測試階段
- [ ] 所有 7 個 API 端點都能正常回應
- [ ] 資料格式符合規範
- [ ] 風險等級轉換正確
- [ ] 高風險數量計算正確
- [ ] 日期格式正確

### 前端整合階段
- [ ] API URL 已設定到前端
- [ ] Layer 1 顯示正確
- [ ] Layer 2 顯示正確
- [ ] Layer 3 顯示正確
- [ ] 圖表顯示正確
- [ ] 資料刷新功能正常

### 效能測試階段
- [ ] API 回應時間可接受
- [ ] 沒有 CORS 錯誤
- [ ] 沒有權限錯誤

---

## 下一步

測試完成後：

1. **生產環境部署**
   - 更新前端 CONFIG 設定
   - 部署到生產環境
   - 監控錯誤日誌

2. **資料維護**
   - 定期更新 Google Sheet 資料
   - 監控 _AuditLog 工作表
   - 檢查資料品質

3. **效能優化**
   - 考慮實作快取機制
   - 監控 API 使用量
   - 優化 Google Sheet 結構

---

**文件版本**: 1.0.0  
**最後更新**: 2025-12-05  
**維護者**: Digital Transformation Team

## 支援

如果遇到問題，請：
1. 檢查此文件的「常見問題排解」章節
2. 查看 Google Apps Script 的執行日誌
3. 檢查瀏覽器 Console 的錯誤訊息
4. 參考 `docs/GOOGLE_SHEET_MAPPING.md` 確認資料結構

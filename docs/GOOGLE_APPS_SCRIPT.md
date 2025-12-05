# Google Apps Script 完整實作

## 版本資訊

- **版本**: 2.1.1
- **最後更新**: 2025-12-05
- **相容性**: Google Apps Script Runtime V8

## 概述

此 Google Apps Script 提供完整的 API 端點，用於從 Google Sheets 讀取數位轉型儀表板資料。

## 安裝步驟

### 1. 建立 Google Apps Script 專案

1. 開啟 [Google Apps Script](https://script.google.com/)
2. 點擊「新增專案」
3. 將下方程式碼貼入編輯器
4. 修改 `SPREADSHEET_ID` 為你的試算表 ID

### 2. 部署為 Web App

1. 點擊「部署」→「新增部署作業」
2. 類型選擇「網頁應用程式」
3. 執行身分：選擇你的帳號
4. 存取權限：選擇「任何人」
5. 點擊「部署」
6. 複製 Web App URL

### 3. 設定儀表板

將取得的 Web App URL 設定到 `js/config.js` 的 `CONFIG.api.googleSheetUrl`

---

## 完整程式碼

```javascript
/**
 * 數位轉型儀表板 - Google Apps Script
 * 版本: 2.1.1
 */

// 試算表 ID（需要替換為實際的 ID）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

/**
 * 處理 HTTP GET 請求
 */
function doGet(e) {
  const action = e.parameter.action || 'getFullData';
  
  let result;
  switch(action) {
    case 'getFullData':
      result = getFullData();
      break;
    case 'getKPI':
      result = getKPI();
      break;
    case 'getProjects':
      result = getProjects(e.parameter.filter);
      break;
    case 'getRisks':
      result = getRisks();
      break;
    case 'getQuickWins':
      result = getQuickWins();
      break;
    case 'getResources':
      result = getResources();
      break;
    case 'getMetrics':
      result = getMetrics();
      break;
    case 'getChartData':
      result = getChartData();
      break;
    case 'getSettings':
      result = getSettings();
      break;
    default:
      result = { error: 'Unknown action' };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 取得完整儀表板資料
 */
function getFullData() {
  return {
    settings: getSettings(),
    kpi: getKPI(),
    quickWins: getQuickWins(),
    risks: getRisks(),
    projects: getProjects(),
    resources: getResources(),
    metrics: getMetrics(),
    charts: getChartData(),
    metadata: {
      version: '2.1.1',
      lastUpdate: new Date().toISOString(),
      source: 'google-sheet'
    }
  };
}

/**
 * 取得設定
 */
function getSettings() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();
  
  const settings = {};
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  
  return {
    title: settings['title'] || '數位轉型儀表板',
    teamName: settings['teamName'] || '管理團隊',
    reportDate: settings['reportDate'] || new Date().toLocaleDateString('zh-TW'),
    refreshInterval: parseInt(settings['refreshInterval']) || 300000
  };
}

/**
 * 取得 KPI 資料
 */
function getKPI() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('KPI');
  const data = sheet.getDataRange().getValues();
  
  return {
    healthScore: data[1][1] || 76,
    healthTrend: data[2][1] || 'up',
    roi: data[3][1] || 145,
    progress: data[4][1] || 73,
    engagement: data[5][1] || 68,
    highRisks: data[6][1] || 0
  };
}

/**
 * 取得 Quick Wins 資料
 */
function getQuickWins() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('QuickWins');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const quickWins = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      quickWins.push({
        title: data[i][0],
        owner: data[i][1],
        deadline: data[i][2],
        progress: data[i][3]
      });
    }
  }
  
  return quickWins;
}

/**
 * 取得風險資料
 */
function getRisks() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Risks');
  const data = sheet.getDataRange().getValues();
  
  const risks = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      risks.push({
        id: data[i][0],
        title: data[i][1],
        probability: data[i][2],
        impact: data[i][3],
        status: data[i][4]
      });
    }
  }
  
  return risks;
}

/**
 * 取得專案資料
 */
function getProjects(filter) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  
  const projects = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      const project = {
        id: data[i][0],
        name: data[i][1],
        department: data[i][2],
        status: data[i][3],
        progress: data[i][4],
        budget: data[i][5],
        timeline: data[i][6]
      };
      
      if (!filter || project.status === filter || project.department === filter) {
        projects.push(project);
      }
    }
  }
  
  return projects;
}

/**
 * 取得資源配置資料
 */
function getResources() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Resources');
  const data = sheet.getDataRange().getValues();
  
  return {
    totalBudget: data[1][1] || '$2.5M',
    usedBudget: data[2][1] || '$1.8M (72%)',
    totalHeadcount: data[3][1] || 45,
    allocatedHeadcount: data[4][1] || '38 (84%)'
  };
}

/**
 * 取得指標資料
 */
function getMetrics() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Metrics');
  const data = sheet.getDataRange().getValues();
  
  return {
    adoption: data[1][1] || '67%',
    satisfaction: data[2][1] || '4.2/5',
    efficiency: data[3][1] || '+28%'
  };
}

/**
 * 取得圖表資料
 */
function getChartData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  return {
    radar: getRadarChartData(ss),
    burndown: getBurndownChartData(ss),
    funnel: getFunnelChartData(ss),
    adoption: getAdoptionChartData(ss)
  };
}

function getRadarChartData(ss) {
  const sheet = ss.getSheetByName('RadarChart');
  const data = sheet.getDataRange().getValues();
  
  return {
    labels: data[0].slice(1),
    current: data[1].slice(1),
    target: data[2].slice(1)
  };
}

function getBurndownChartData(ss) {
  const sheet = ss.getSheetByName('BurndownChart');
  const data = sheet.getDataRange().getValues();
  
  return {
    labels: data[0].slice(1),
    ideal: data[1].slice(1),
    actual: data[2].slice(1)
  };
}

function getFunnelChartData(ss) {
  const sheet = ss.getSheetByName('FunnelChart');
  const data = sheet.getDataRange().getValues();
  
  return {
    labels: data.slice(1).map(row => row[0]),
    values: data.slice(1).map(row => row[1])
  };
}

function getAdoptionChartData(ss) {
  const sheet = ss.getSheetByName('AdoptionChart');
  const data = sheet.getDataRange().getValues();
  
  return {
    labels: data.slice(1).map(row => row[0]),
    values: data.slice(1).map(row => row[1])
  };
}
```

---

## API 端點說明

### 取得完整資料
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getFullData
```

### 取得設定
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getSettings
```

### 取得 KPI
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getKPI
```

### 取得專案列表
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getProjects
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getProjects&filter=進行中
```

### 取得風險
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getRisks
```

### 取得 Quick Wins
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getQuickWins
```

### 取得資源配置
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getResources
```

### 取得指標
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getMetrics
```

### 取得圖表資料
```
GET https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec?action=getChartData
```

---

## 測試方法

1. 部署完成後，在瀏覽器中開啟 Web App URL
2. 應該會看到完整的 JSON 資料
3. 測試不同的 action 參數

---

## 常見問題

### Q: 如何找到試算表 ID？
A: 開啟 Google Sheet，URL 中 `/d/` 後面的字串就是 SPREADSHEET_ID

範例：
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                      ^^^^^^^^
                                   這就是 ID
```

### Q: 部署後無法存取？
A: 檢查以下項目：
1. 執行身分是否正確
2. 存取權限是否設定為「任何人」
3. SPREADSHEET_ID 是否正確
4. 工作表名稱是否與程式碼一致

### Q: 如何更新部署？
A: 
1. 修改程式碼後
2. 點擊「部署」→「管理部署作業」
3. 點擊編輯（鉛筆圖示）
4. 版本選擇「新版本」
5. 點擊「部署」

---

## 安全性建議

1. **限制存取權限**: 若資料敏感，建議設定為「僅限組織內的使用者」
2. **使用 API Key**: 在 doGet 中加入簡單的 API Key 驗證
3. **CORS 設定**: 根據需求設定允許的來源網域
4. **速率限制**: Google Apps Script 有內建的配額限制

---

## 進階功能

### 加入快取機制

```javascript
const CACHE_DURATION = 300; // 5 分鐘

function getFullDataWithCache() {
  const cache = CacheService.getScriptCache();
  let data = cache.get('fullData');
  
  if (!data) {
    data = JSON.stringify(getFullData());
    cache.put('fullData', data, CACHE_DURATION);
  }
  
  return JSON.parse(data);
}
```

### 加入錯誤處理

```javascript
function doGet(e) {
  try {
    // ... 原有程式碼
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 相關文件

- [Google Sheet Template](./GOOGLE_SHEET_TEMPLATE.md)
- [Integration Test](./INTEGRATION_TEST.md)
- [Data Schema](./DATA_SCHEMA.md)

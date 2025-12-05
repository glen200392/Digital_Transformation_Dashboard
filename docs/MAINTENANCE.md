# 維護指南 (Maintenance Guide)

本文件提供數位轉型儀表板的維護和管理指南。

## 目錄

- [系統架構](#系統架構)
- [如何更新 API 端點](#如何更新-api-端點)
- [如何修改 KPI 閾值](#如何修改-kpi-閾值)
- [如何調整 UI 樣式](#如何調整-ui-樣式)
- [如何添加新的圖表](#如何添加新的圖表)
- [故障排除指南](#故障排除指南)
- [常見問題 FAQ](#常見問題-faq)

---

## 系統架構

### 模組結構

```
js/
├── config.js          # 全域設定檔
├── security.js        # 安全性模組 (NEW in v2.1.0)
├── auditLog.js        # 審計日誌模組 (NEW in v2.1.0)
├── dataProtection.js  # 資料保護模組 (NEW in v2.1.0)
├── api.js             # API 呼叫模組
├── state.js           # 狀態管理器
├── charts.js          # 圖表管理模組
├── ui.js              # UI 更新模組
└── app.js             # 主程式入口
```

### 模組載入順序

**重要**: 必須按照以下順序載入模組：

1. `config.js` - 設定必須最先載入
2. `security.js` - 安全模組
3. `auditLog.js` - 審計日誌
4. `dataProtection.js` - 資料保護
5. `api.js` - API 模組
6. `state.js` - 狀態管理
7. `charts.js` - 圖表管理
8. `ui.js` - UI 管理
9. `app.js` - 主程式

---

## 如何更新 API 端點

### 步驟 1: 修改 config.js

找到 `CONFIG.api.baseUrl` 並更新：

```javascript
api: {
    baseUrl: "https://your-new-api-endpoint.com/exec",
    // 其他設定保持不變
}
```

### 步驟 2: 測試連線

開啟瀏覽器 Console，執行：

```javascript
const testApi = new DashboardAPI();
testApi.getFullData()
    .then(data => console.log('API 測試成功:', data))
    .catch(error => console.error('API 測試失敗:', error));
```

### 步驟 3: 更新離線備用資料

如果 API 端點改變，記得更新 `data/fallback.json` 以確保離線模式正常運作。

---

## 如何修改 KPI 閾值

### 修改閾值標準

在 `js/config.js` 中找到 `thresholds` 物件：

```javascript
thresholds: {
    healthScore: { 
        green: 80,   // >= 80 顯示綠色（優秀）
        yellow: 60,  // >= 60 顯示黃色（正常）
        // < 60 顯示紅色（需改善）
    },
    roi: { 
        green: 150,  // >= 150% 顯示綠色
        yellow: 100  // >= 100% 顯示黃色
    },
    // ... 其他閾值
}
```

### 閾值邏輯

- **一般 KPI（數值越高越好）**:
  - `value >= green` → 綠色狀態
  - `value >= yellow` → 黃色狀態
  - `value < yellow` → 紅色狀態

- **反向 KPI（數值越低越好，如風險）**:
  - `value <= green` → 綠色狀態
  - `value <= yellow` → 黃色狀態
  - `value > yellow` → 紅色狀態

### 範例：調整投資報酬率標準

```javascript
roi: { 
    green: 200,   // 改為 >= 200% 才顯示綠色
    yellow: 120   // 改為 >= 120% 顯示黃色
}
```

---

## 如何調整 UI 樣式

### CSS 變數

所有主要顏色定義在 `css/styles.css` 的 `:root` 中：

```css
:root {
    --primary-color: #667eea;
    --success-color: #4ade80;
    --warning-color: #facc15;
    --danger-color: #f87171;
    --bg-color: #f8fafc;
    --text-color: #1e293b;
}
```

### 修改主題顏色

**範例：更改主色調為藍色**

```css
:root {
    --primary-color: #3b82f6;  /* 改為藍色 */
}
```

### 修改卡片樣式

找到 `.kpi-card` 類別：

```css
.kpi-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    /* 修改這裡的屬性 */
}
```

### 響應式設計

調整斷點在 media query 中：

```css
@media (max-width: 768px) {
    /* 平板和手機的樣式 */
}
```

---

## 如何添加新的圖表

### 步驟 1: 在 HTML 中添加 Canvas

在 `index.html` 中添加：

```html
<div class="chart-container">
    <canvas id="my-new-chart"></canvas>
</div>
```

### 步驟 2: 在 ChartManager 中添加初始化方法

編輯 `js/charts.js`：

```javascript
class ChartManager {
    // ... 現有程式碼
    
    /**
     * 初始化新圖表
     */
    initMyNewChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        // 如果已存在，先銷毀
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',  // 或 'line', 'pie', 'doughnut' 等
            data: {
                labels: data.labels,
                datasets: [{
                    label: '我的新圖表',
                    data: data.values,
                    backgroundColor: CONFIG.charts.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
        
        console.log(`[Charts] ${canvasId} 已初始化`);
    }
}
```

### 步驟 3: 在 App.js 中呼叫

在適當的 Layer 初始化函數中呼叫：

```javascript
initializeLayer2Charts(data) {
    if (data.charts) {
        // ... 現有圖表
        
        // 添加新圖表
        if (data.charts.myNewChart) {
            this.charts.initMyNewChart('my-new-chart', data.charts.myNewChart);
        }
    }
}
```

---

## 故障排除指南

### 問題 1: 儀表板無法載入資料

**症狀**: 顯示「無法載入資料」錯誤訊息

**可能原因**:
1. API 端點無法連接
2. CORS 問題
3. API 回應格式錯誤

**解決方法**:
1. 開啟 Console 查看錯誤訊息
2. 檢查 Network 標籤確認 API 請求狀態
3. 驗證 API 端點是否正確
4. 檢查 `data/fallback.json` 是否存在作為備用

```javascript
// 手動測試 API
fetch(CONFIG.api.baseUrl)
    .then(r => r.json())
    .then(d => console.log(d))
    .catch(e => console.error(e));
```

### 問題 2: Chart.js 無法載入

**症狀**: 圖表區域空白或顯示警告訊息

**可能原因**:
1. CDN 被阻擋
2. SRI hash 不匹配
3. 網路問題

**解決方法**:
1. 檢查 Console 是否有 Chart.js 載入錯誤
2. 驗證 SRI hash 是否正確
3. 考慮使用本地 Chart.js 檔案

### 問題 3: 樣式顯示異常

**症狀**: 佈局混亂或顏色錯誤

**可能原因**:
1. CSS 檔案未載入
2. CSS 變數被覆蓋
3. 瀏覽器快取問題

**解決方法**:
1. 清除瀏覽器快取 (Ctrl+Shift+R)
2. 檢查 `css/styles.css` 是否正確載入
3. 檢查 Console 是否有 CSS 錯誤

### 問題 4: localStorage 儲存空間不足

**症狀**: 備份或日誌無法儲存

**可能原因**:
1. localStorage 配額已滿 (通常 5-10MB)
2. 備份或日誌過多

**解決方法**:

```javascript
// 查看儲存使用情況
const dp = new DataProtection();
console.log(dp.getStorageUsage());

const al = new AuditLogger();
console.log(al.getLogStatistics());

// 清除舊備份
dp.clearOldBackups(2);  // 只保留 2 個備份

// 清除過期日誌
al.clearExpiredLogs();
```

### 問題 5: 速率限制觸發

**症狀**: 顯示「請求頻率過高」錯誤

**解決方法**:

```javascript
// 檢查剩餘請求數
const security = new Security();
console.log('剩餘請求數:', security.getRemainingRequests('api'));

// 重置速率限制（僅用於測試）
security.resetRateLimit();
```

---

## 常見問題 FAQ

### Q1: 如何更改自動刷新間隔？

**A**: 在 `js/config.js` 中修改：

```javascript
refresh: {
    enabled: true,
    interval: 10 * 60 * 1000,  // 改為 10 分鐘
}
```

### Q2: 如何停用審計日誌？

**A**: 在 `js/config.js` 中修改：

```javascript
security: {
    enableAuditLog: false,
}
```

### Q3: 如何匯出審計日誌？

**A**: 在瀏覽器 Console 中執行：

```javascript
const auditLogger = window.dashboardApp.auditLogger;

// 匯出為 JSON
auditLogger.downloadLogs('json');

// 匯出為 CSV
auditLogger.downloadLogs('csv');
```

### Q4: 如何還原備份？

**A**: 在瀏覽器 Console 中執行：

```javascript
const dp = window.dashboardApp.dataProtection;

// 查看可用備份
const backups = dp.getBackupList();
console.table(backups);

// 還原特定版本
const data = dp.restoreBackup(backups[0].version);
if (data) {
    window.dashboardApp.state.setData(data);
    window.dashboardApp.updateUI(data);
}
```

### Q5: 如何查看速率限制狀態？

**A**: 在瀏覽器 Console 中執行：

```javascript
const security = window.dashboardApp.security;
console.log('剩餘請求數:', security.getRemainingRequests('api'));
```

### Q6: 如何啟用除錯模式？

**A**: 在 `js/config.js` 中修改：

```javascript
features: {
    debugMode: true
}
```

然後重新載入頁面，所有模組將輸出詳細的 log。

### Q7: 如何修改備份保留數量？

**A**: 在 `js/config.js` 中修改：

```javascript
dataProtection: {
    maxBackupVersions: 10,  // 改為保留 10 個版本
}
```

### Q8: 如何更改 CSP 政策？

**A**: 在 `index.html` 的 `<head>` 中修改 CSP meta 標籤：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://your-trusted-domain.com;">
```

---

## 維護檢查清單

### 每週檢查
- [ ] 檢查 Console 是否有錯誤
- [ ] 驗證 API 連線正常
- [ ] 檢查資料更新是否及時

### 每月檢查
- [ ] 清理過期的審計日誌
- [ ] 檢查 localStorage 使用情況
- [ ] 更新離線備用資料
- [ ] 檢查備份功能正常

### 每季檢查
- [ ] 更新依賴版本（Chart.js 等）
- [ ] 審查安全性設定
- [ ] 檢查效能指標
- [ ] 更新文件

---

## 支援與聯絡

如果遇到本文件未涵蓋的問題：

1. 查看 [CHANGELOG.md](../CHANGELOG.md) 了解最新變更
2. 查看 [DATA_SCHEMA.md](DATA_SCHEMA.md) 了解資料結構
3. 查看 [SECURITY.md](SECURITY.md) 了解安全性設定
4. 開啟 GitHub Issue 報告問題

---

**文件版本**: 2.1.0  
**最後更新**: 2025-12-05  
**維護者**: Digital Transformation Team

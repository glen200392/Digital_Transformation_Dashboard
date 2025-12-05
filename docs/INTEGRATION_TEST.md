# 整合測試清單

## 版本資訊

- **版本**: 2.1.1
- **最後更新**: 2025-12-05

## 概述

此文件包含數位轉型儀表板與 Google Apps Script 整合的完整測試清單。

---

## 測試前準備

### 環境檢查

- [ ] Google Sheet 已建立並填入測試資料
- [ ] Google Apps Script 已部署為 Web App
- [ ] Web App URL 已設定到 `js/config.js`
- [ ] 瀏覽器開發者工具已開啟（查看 Console 和 Network）

### 測試資料準備

- [ ] Settings 工作表包含完整設定
- [ ] KPI 工作表包含所有必要欄位
- [ ] QuickWins 工作表至少有 3 筆資料
- [ ] Risks 工作表至少有 3 筆資料
- [ ] Projects 工作表至少有 5 筆資料
- [ ] 所有圖表工作表包含有效資料

---

## 1. Google Sheet 連線測試

### 1.1 基本連線測試

- [ ] **測試**: 在瀏覽器中直接開啟 Web App URL
  - **預期結果**: 返回完整的 JSON 資料
  - **驗證點**: 
    - 回應格式為有效的 JSON
    - 包含所有主要欄位（settings, kpi, quickWins, risks, projects, resources, metrics, charts, metadata）
    - HTTP 狀態碼為 200

- [ ] **測試**: 檢查 CORS 設定
  - **預期結果**: 儀表板可以成功呼叫 API
  - **驗證點**: 
    - Console 沒有 CORS 錯誤
    - Network tab 顯示請求成功

### 1.2 網路錯誤測試

- [ ] **測試**: 關閉網路連線後重新整理儀表板
  - **預期結果**: 顯示離線模式，載入 fallback.json
  - **驗證點**:
    - 同步狀態顯示 🟠 離線資料
    - Console 顯示「嘗試載入離線備用資料」
    - UI 正常顯示（使用 fallback 資料）

- [ ] **測試**: 提供錯誤的 Web App URL
  - **預期結果**: 優雅地處理錯誤，回退到離線模式
  - **驗證點**:
    - 顯示錯誤通知
    - 不會導致頁面崩潰
    - 載入 fallback 資料

---

## 2. API 端點測試

### 2.1 getFullData

- [ ] **測試**: `?action=getFullData`
  - **預期結果**: 返回所有資料
  - **驗證點**:
    - 包含 settings 物件
    - 包含 kpi 物件
    - 包含 quickWins 陣列
    - 包含 risks 陣列
    - 包含 projects 陣列
    - 包含 resources 物件
    - 包含 metrics 物件
    - 包含 charts 物件
    - metadata.source 為 'google-sheet'
    - metadata.version 為 '2.1.1'

### 2.2 getSettings

- [ ] **測試**: `?action=getSettings`
  - **預期結果**: 返回設定資料
  - **驗證點**:
    - 包含 title 欄位
    - 包含 teamName 欄位
    - 包含 reportDate 欄位
    - 包含 refreshInterval 欄位
    - 所有值與 Google Sheet 一致

### 2.3 getKPI

- [ ] **測試**: `?action=getKPI`
  - **預期結果**: 返回 KPI 資料
  - **驗證點**:
    - 包含 healthScore (數字)
    - 包含 healthTrend (字串)
    - 包含 roi (數字)
    - 包含 progress (數字)
    - 包含 engagement (數字)
    - 包含 highRisks (數字)

### 2.4 getProjects

- [ ] **測試**: `?action=getProjects`
  - **預期結果**: 返回所有專案
  - **驗證點**:
    - 返回陣列
    - 每個專案包含 id, name, department, status, progress, budget, timeline
    - 專案數量與 Google Sheet 一致

- [ ] **測試**: `?action=getProjects&filter=進行中`
  - **預期結果**: 只返回狀態為「進行中」的專案
  - **驗證點**:
    - 所有返回的專案 status 都是「進行中」
    - 過濾正確

### 2.5 getRisks

- [ ] **測試**: `?action=getRisks`
  - **預期結果**: 返回所有風險
  - **驗證點**:
    - 返回陣列
    - 每個風險包含 id, title, probability, impact, status
    - 風險數量與 Google Sheet 一致

### 2.6 getQuickWins

- [ ] **測試**: `?action=getQuickWins`
  - **預期結果**: 返回所有 Quick Wins
  - **驗證點**:
    - 返回陣列
    - 每個項目包含 title, owner, deadline, progress
    - 項目數量與 Google Sheet 一致

### 2.7 getResources

- [ ] **測試**: `?action=getResources`
  - **預期結果**: 返回資源配置資料
  - **驗證點**:
    - 包含 totalBudget
    - 包含 usedBudget
    - 包含 totalHeadcount
    - 包含 allocatedHeadcount

### 2.8 getMetrics

- [ ] **測試**: `?action=getMetrics`
  - **預期結果**: 返回關鍵指標
  - **驗證點**:
    - 包含 adoption
    - 包含 satisfaction
    - 包含 efficiency

### 2.9 getChartData

- [ ] **測試**: `?action=getChartData`
  - **預期結果**: 返回所有圖表資料
  - **驗證點**:
    - 包含 radar 物件（labels, current, target）
    - 包含 burndown 物件（labels, ideal, actual）
    - 包含 funnel 物件（labels, values）
    - 包含 adoption 物件（labels, values）

---

## 3. 各資料表讀取測試

### 3.1 Settings 工作表

- [ ] **測試**: 修改 Settings 工作表中的 title
  - **預期結果**: 重新整理儀表板後，標題更新
  - **驗證點**:
    - Header 顯示新標題
    - Console 顯示「Settings 已更新」

- [ ] **測試**: 修改 teamName
  - **預期結果**: 團隊名稱更新
  - **驗證點**:
    - Header meta 區域顯示新團隊名稱

### 3.2 KPI 工作表

- [ ] **測試**: 修改 healthScore 為 90
  - **預期結果**: 健康度總分顯示 90
  - **驗證點**:
    - Layer 1 的健康度總分更新
    - 趨勢圖示正確

- [ ] **測試**: 修改 roi 為 160
  - **預期結果**: ROI 卡片顯示 160%
  - **驗證點**:
    - KPI 卡片值更新
    - 狀態顏色正確（綠色）

### 3.3 QuickWins 工作表

- [ ] **測試**: 新增一筆 Quick Win
  - **預期結果**: Layer 2 顯示新項目
  - **驗證點**:
    - Quick Wins 列表包含新項目
    - 進度條正確顯示
    - 圖示顏色正確

- [ ] **測試**: 修改某項目 progress 為 100
  - **預期結果**: 進度條顯示 100%，圖示變為 ✅
  - **驗證點**:
    - 進度條填滿
    - 圖示為綠色勾選

### 3.4 Risks 工作表

- [ ] **測試**: 新增一筆高/高風險
  - **預期結果**: 風險熱力圖更新
  - **驗證點**:
    - 高/高格子的計數增加
    - highRisks KPI 增加（如果是高風險）

- [ ] **測試**: 修改風險的 probability 和 impact
  - **預期結果**: 風險在熱力圖中移動到正確位置
  - **驗證點**:
    - 計數正確更新

### 3.5 Projects 工作表

- [ ] **測試**: 新增一筆專案
  - **預期結果**: Layer 3 專案表格顯示新專案
  - **驗證點**:
    - 表格包含新列
    - 所有欄位正確顯示
    - 進度條正確

- [ ] **測試**: 修改專案狀態
  - **預期結果**: 狀態圓點顏色更新
  - **驗證點**:
    - 狀態文字更新
    - 顏色指示器正確

### 3.6 Resources 工作表

- [ ] **測試**: 修改 totalBudget
  - **預期結果**: Layer 3 資源卡片更新
  - **驗證點**:
    - 總預算顯示新值

### 3.7 Metrics 工作表

- [ ] **測試**: 修改 adoption 為 75%
  - **預期結果**: Layer 3 指標卡片更新
  - **驗證點**:
    - 技術採用率顯示 75%

### 3.8 圖表工作表

- [ ] **測試**: 修改 RadarChart 資料
  - **預期結果**: Layer 2 雷達圖更新
  - **驗證點**:
    - 圖表重繪
    - 新數值正確顯示

- [ ] **測試**: 修改 BurndownChart 資料
  - **預期結果**: Layer 2 燃盡圖更新
  - **驗證點**:
    - 兩條線正確顯示

- [ ] **測試**: 修改 FunnelChart 資料
  - **預期結果**: Layer 3 漏斗圖更新
  - **驗證點**:
    - 各階段比例正確

- [ ] **測試**: 修改 AdoptionChart 資料
  - **預期結果**: Layer 3 採用曲線圖更新
  - **驗證點**:
    - 各類別比例正確

---

## 4. 錯誤處理測試

### 4.1 資料缺失測試

- [ ] **測試**: 刪除 Settings 工作表
  - **預期結果**: 使用預設值，不崩潰
  - **驗證點**:
    - Console 顯示錯誤訊息
    - 使用備用設定值

- [ ] **測試**: 刪除 KPI 工作表某欄位
  - **預期結果**: 使用預設值
  - **驗證點**:
    - 缺失的 KPI 顯示預設值
    - 其他 KPI 正常顯示

### 4.2 資料格式錯誤

- [ ] **測試**: 在 progress 欄位輸入文字而非數字
  - **預期結果**: 處理為 0 或預設值
  - **驗證點**:
    - 不會導致 JavaScript 錯誤
    - 顯示合理的備用值

- [ ] **測試**: 日期格式錯誤
  - **預期結果**: 顯示原始文字或預設日期
  - **驗證點**:
    - 不會崩潰

### 4.3 權限錯誤

- [ ] **測試**: 將 Apps Script 權限改為私有
  - **預期結果**: API 呼叫失敗，回退到離線模式
  - **驗證點**:
    - Console 顯示權限錯誤
    - 載入 fallback 資料
    - 同步狀態顯示錯誤

---

## 5. 快取機制測試

### 5.1 快取運作

- [ ] **測試**: 首次載入頁面
  - **預期結果**: 從 Google Sheet 載入資料
  - **驗證點**:
    - Network tab 顯示 API 請求
    - 同步狀態顯示 🟢 Google Sheet (即時)

- [ ] **測試**: 5 分鐘內重新整理頁面
  - **預期結果**: 使用快取資料（如果啟用）
  - **驗證點**:
    - 載入速度較快
    - 可能顯示 🟡 快取資料

### 5.2 快取清除

- [ ] **測試**: 點擊「重新整理」按鈕
  - **預期結果**: 清除快取，重新載入
  - **驗證點**:
    - Network tab 顯示新的 API 請求
    - 資料更新為最新

---

## 6. 離線模式測試

### 6.1 完全離線

- [ ] **測試**: 關閉網路，開啟儀表板
  - **預期結果**: 載入 fallback.json
  - **驗證點**:
    - 同步狀態顯示 🟠 離線資料
    - Console 顯示「已載入離線備用資料」
    - UI 正常顯示

### 6.2 部分離線（API 無法存取但網路正常）

- [ ] **測試**: 網路正常但 API 回傳錯誤
  - **預期結果**: 回退到 fallback.json
  - **驗證點**:
    - 顯示警告通知
    - 載入備用資料

---

## 7. 同步狀態顯示測試

### 7.1 狀態指示器

- [ ] **測試**: 成功連接 Google Sheet
  - **預期結果**: 顯示 🟢 Google Sheet (即時)
  - **驗證點**:
    - 顏色為綠色
    - 文字正確
    - 樣式類別為 sync-live

- [ ] **測試**: 使用快取資料
  - **預期結果**: 顯示 🟡 快取資料
  - **驗證點**:
    - 顏色為黃色
    - 樣式類別為 sync-cache

- [ ] **測試**: 使用離線資料
  - **預期結果**: 顯示 🟠 離線資料
  - **驗證點**:
    - 顏色為橘色
    - 樣式類別為 sync-offline
    - metadata.source 為 'fallback'

- [ ] **測試**: 連接錯誤
  - **預期結果**: 顯示 🔴 無法連接
  - **驗證點**:
    - 顏色為紅色
    - 樣式類別為 sync-error

### 7.2 動態更新

- [ ] **測試**: 從線上切換到離線
  - **預期結果**: 同步狀態自動更新
  - **驗證點**:
    - 狀態指示器即時變化
    - 通知訊息顯示

---

## 8. 效能測試

### 8.1 載入時間

- [ ] **測試**: 測量首次載入時間
  - **預期結果**: < 3 秒
  - **驗證點**:
    - Network tab waterfall
    - Performance tab timing

### 8.2 資料量測試

- [ ] **測試**: Projects 工作表包含 50+ 筆資料
  - **預期結果**: 正常載入和顯示
  - **驗證點**:
    - 表格正常渲染
    - 無卡頓

- [ ] **測試**: QuickWins 工作表包含 20+ 筆資料
  - **預期結果**: 正常載入和顯示
  - **驗證點**:
    - 列表正常渲染
    - 滾動流暢

---

## 9. 瀏覽器相容性測試

- [ ] **Chrome**: 所有功能正常
- [ ] **Firefox**: 所有功能正常
- [ ] **Safari**: 所有功能正常
- [ ] **Edge**: 所有功能正常
- [ ] **行動版 Chrome**: 響應式設計正常
- [ ] **行動版 Safari**: 響應式設計正常

---

## 10. 整合端到端測試

### 完整使用者流程

- [ ] **測試**: 完整的使用者操作流程
  1. 開啟儀表板
  2. 檢查 Layer 1 KPI
  3. 切換到 Layer 2 查看 Quick Wins 和風險
  4. 切換到 Layer 3 查看專案詳情
  5. 切換各個 Tab
  6. 點擊重新整理按鈕
  7. 檢查所有圖表正常顯示
  
  - **預期結果**: 所有操作流暢，無錯誤
  - **驗證點**:
    - Console 無錯誤
    - UI 更新正確
    - 圖表正常顯示
    - 同步狀態正確

---

## 測試報告範本

### 測試資訊

- **測試日期**: YYYY-MM-DD
- **測試人員**: 
- **環境**: 
  - 瀏覽器: 
  - 版本: 
  - 作業系統: 

### 測試結果

| 測試項目 | 狀態 | 備註 |
|---------|------|------|
| 1. Google Sheet 連線 | ✅/❌ | |
| 2. API 端點 | ✅/❌ | |
| 3. 資料表讀取 | ✅/❌ | |
| 4. 錯誤處理 | ✅/❌ | |
| 5. 快取機制 | ✅/❌ | |
| 6. 離線模式 | ✅/❌ | |
| 7. 同步狀態 | ✅/❌ | |
| 8. 效能 | ✅/❌ | |
| 9. 瀏覽器相容性 | ✅/❌ | |
| 10. 端到端 | ✅/❌ | |

### 問題清單

| 問題編號 | 描述 | 嚴重程度 | 狀態 |
|---------|------|---------|------|
| 1 | | 高/中/低 | 開啟/已修復 |

### 結論

- **整體測試通過率**: ___%
- **主要問題**: 
- **建議**: 

---

## 相關文件

- [Google Apps Script](./GOOGLE_APPS_SCRIPT.md)
- [Google Sheet Template](./GOOGLE_SHEET_TEMPLATE.md)
- [Security Documentation](./SECURITY.md)

# Google Sheet 工作表結構文件

## 版本資訊

- **版本**: 2.1.1
- **最後更新**: 2025-12-05

## 概述

此文件定義數位轉型儀表板所需的 Google Sheet 結構。請建立一個新的 Google Sheet，並依照以下規格建立 11 個工作表。

---

## 快速建立指南

1. 建立新的 Google Sheet
2. 依序建立以下 11 個工作表
3. 在每個工作表中建立對應的欄位和範例資料
4. 複製 Spreadsheet ID（從 URL 中取得）
5. 在 Google Apps Script 中設定 SPREADSHEET_ID

---

## 工作表詳細規格

### 1. Settings - 儀表板設定

**用途**: 儲存儀表板的全域設定

**欄位結構**:

| key | value |
|-----|-------|
| title | 數位轉型儀表板 |
| teamName | 管理團隊 |
| reportDate | 2025-12-05 |
| refreshInterval | 300000 |

**欄位說明**:
- `title`: 儀表板標題
- `teamName`: 團隊名稱
- `reportDate`: 報告日期（格式: YYYY-MM-DD）
- `refreshInterval`: 自動刷新間隔（毫秒）

**範例資料**:
```
A1: key          B1: value
A2: title        B2: 數位轉型儀表板
A3: teamName     B3: 管理團隊
A4: reportDate   B4: 2025-12-05
A5: refreshInterval  B5: 300000
```

---

### 2. KPI - KPI 數據

**用途**: 儲存關鍵績效指標

**欄位結構**:

| metric | value |
|--------|-------|
| healthScore | 76 |
| healthTrend | up |
| roi | 145 |
| progress | 73 |
| engagement | 68 |
| highRisks | 0 |

**欄位說明**:
- `healthScore`: 轉型健康度總分（0-100）
- `healthTrend`: 趨勢（up/down/stable）
- `roi`: 投資報酬率（%）
- `progress`: 整體進度（%）
- `engagement`: 員工參與度（%）
- `highRisks`: 高風險項目數量

**範例資料**:
```
A1: metric       B1: value
A2: healthScore  B2: 76
A3: healthTrend  B3: up
A4: roi          B4: 145
A5: progress     B5: 73
A6: engagement   B6: 68
A7: highRisks    B7: 0
```

---

### 3. QuickWins - Quick Wins

**用途**: 追蹤快速見效的項目

**欄位結構**:

| title | owner | deadline | progress |
|-------|-------|----------|----------|
| 自動化報表系統 | IT 部門 | 2025-12-15 | 85 |
| 線上協作平台導入 | 人資部 | 2025-12-20 | 72 |
| 客戶自助服務入口 | 客服部 | 2025-12-25 | 58 |
| 數據視覺化儀表板 | 數據分析組 | 2025-12-30 | 45 |

**欄位說明**:
- `title`: 項目名稱
- `owner`: 負責人/部門
- `deadline`: 截止日期（格式: YYYY-MM-DD）
- `progress`: 完成進度（%）

**範例資料**:
```
A1: title                 B1: owner       C1: deadline    D1: progress
A2: 自動化報表系統        B2: IT 部門     C2: 2025-12-15  D2: 85
A3: 線上協作平台導入      B3: 人資部      C3: 2025-12-20  D3: 72
A4: 客戶自助服務入口      B4: 客服部      C4: 2025-12-25  D4: 58
A5: 數據視覺化儀表板      B5: 數據分析組  C5: 2025-12-30  D5: 45
```

---

### 4. Risks - 風險登記

**用途**: 追蹤專案風險

**欄位結構**:

| id | title | probability | impact | status |
|----|-------|-------------|--------|--------|
| 1 | 預算超支風險 | low | med | 監控中 |
| 2 | 人才流失 | med | high | 已緩解 |
| 3 | 技術債務累積 | med | med | 處理中 |
| 4 | 數據安全問題 | low | high | 已緩解 |

**欄位說明**:
- `id`: 風險編號
- `title`: 風險描述
- `probability`: 發生機率（low/med/high）
- `impact`: 影響程度（low/med/high）
- `status`: 當前狀態

**範例資料**:
```
A1: id  B1: title          C1: probability  D1: impact  E1: status
A2: 1   B2: 預算超支風險   C2: low          D2: med     E2: 監控中
A3: 2   B3: 人才流失       C3: med          D3: high    E3: 已緩解
A4: 3   B4: 技術債務累積   C4: med          D4: med     E4: 處理中
A5: 4   B5: 數據安全問題   C5: low          D5: high    E5: 已緩解
```

---

### 5. Projects - 專案列表

**用途**: 追蹤所有轉型專案

**欄位結構**:

| id | name | department | status | progress | budget | timeline |
|----|------|------------|--------|----------|--------|----------|
| 1 | 核心系統現代化 | IT | 進行中 | 65 | $500K | Q1-Q4 2025 |
| 2 | 客戶體驗優化 | 業務 | 進行中 | 78 | $300K | Q2-Q3 2025 |
| 3 | 數據分析平台 | 數據 | 進行中 | 52 | $450K | Q1-Q3 2025 |
| 4 | 雲端遷移計畫 | IT | 規劃中 | 35 | $800K | Q3 2025-Q1 2026 |
| 5 | AI 客服機器人 | 客服 | 進行中 | 88 | $200K | Q1-Q2 2025 |

**欄位說明**:
- `id`: 專案編號
- `name`: 專案名稱
- `department`: 負責部門
- `status`: 專案狀態（規劃中/進行中/已完成/暫停）
- `progress`: 完成進度（%）
- `budget`: 預算
- `timeline`: 時程

**範例資料**:
```
A1: id  B1: name           C1: department  D1: status  E1: progress  F1: budget  G1: timeline
A2: 1   B2: 核心系統現代化  C2: IT         D2: 進行中  E2: 65        F2: $500K   G2: Q1-Q4 2025
A3: 2   B3: 客戶體驗優化    C3: 業務       D3: 進行中  E3: 78        F3: $300K   G3: Q2-Q3 2025
A4: 3   B4: 數據分析平台    C4: 數據       D4: 進行中  E4: 52        F4: $450K   G4: Q1-Q3 2025
A5: 4   B5: 雲端遷移計畫    C5: IT         D5: 規劃中  E5: 35        F5: $800K   G5: Q3 2025-Q1 2026
A6: 5   B6: AI 客服機器人   C6: 客服       D6: 進行中  E6: 88        F6: $200K   G6: Q1-Q2 2025
```

---

### 6. Resources - 資源配置

**用途**: 追蹤資源使用情況

**欄位結構**:

| metric | value |
|--------|-------|
| totalBudget | $2.5M |
| usedBudget | $1.8M (72%) |
| totalHeadcount | 45 |
| allocatedHeadcount | 38 (84%) |

**欄位說明**:
- `totalBudget`: 總預算
- `usedBudget`: 已使用預算
- `totalHeadcount`: 總人力
- `allocatedHeadcount`: 已配置人力

**範例資料**:
```
A1: metric              B1: value
A2: totalBudget         B2: $2.5M
A3: usedBudget          B3: $1.8M (72%)
A4: totalHeadcount      B4: 45
A5: allocatedHeadcount  B5: 38 (84%)
```

---

### 7. Metrics - 關鍵指標

**用途**: 儲存其他關鍵成功指標

**欄位結構**:

| metric | value |
|--------|-------|
| adoption | 67% |
| satisfaction | 4.2/5 |
| efficiency | +28% |

**欄位說明**:
- `adoption`: 技術採用率
- `satisfaction`: 用戶滿意度
- `efficiency`: 效率提升

**範例資料**:
```
A1: metric       B1: value
A2: adoption     B2: 67%
A3: satisfaction B3: 4.2/5
A4: efficiency   B4: +28%
```

---

### 8. RadarChart - 雷達圖數據

**用途**: 轉型成熟度分析資料

**欄位結構**:

| type | 策略規劃 | 流程優化 | 技術能力 | 人才發展 | 數據治理 | 創新文化 |
|------|---------|---------|---------|---------|---------|---------|
| current | 75 | 82 | 68 | 71 | 79 | 85 |
| target | 85 | 90 | 85 | 85 | 90 | 90 |

**欄位說明**:
- `type`: 資料類型（current = 當前值, target = 目標值）
- 各維度分數（0-100）

**範例資料**:
```
A1: type     B1: 策略規劃  C1: 流程優化  D1: 技術能力  E1: 人才發展  F1: 數據治理  G1: 創新文化
A2: current  B2: 75       C2: 82       D2: 68       E2: 71       F2: 79       G2: 85
A3: target   B3: 85       C3: 90       D3: 85       E3: 85       F3: 90       G3: 90
```

---

### 9. BurndownChart - 燃盡圖數據

**用途**: 專案進度燃盡圖

**欄位結構**:

| type | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 |
|------|--------|--------|--------|--------|--------|--------|
| ideal | 100 | 83 | 66 | 49 | 32 | 15 |
| actual | 100 | 85 | 68 | 52 | 35 | 18 |

**欄位說明**:
- `type`: 資料類型（ideal = 理想值, actual = 實際值）
- 各週剩餘工作量

**範例資料**:
```
A1: type    B1: Week 1  C1: Week 2  D1: Week 3  E1: Week 4  F1: Week 5  G1: Week 6
A2: ideal   B2: 100     C2: 83      D2: 66      E2: 49      F2: 32      G2: 15
A3: actual  B3: 100     C3: 85      D3: 68      E3: 52      F3: 35      G3: 18
```

---

### 10. FunnelChart - 漏斗圖數據

**用途**: 能力建設漏斗分析

**欄位結構**:

| stage | value |
|-------|-------|
| 認知階段 | 450 |
| 學習階段 | 320 |
| 實作階段 | 180 |
| 精通階段 | 95 |
| 教學階段 | 42 |

**欄位說明**:
- `stage`: 階段名稱
- `value`: 人數

**範例資料**:
```
A1: stage     B1: value
A2: 認知階段  B2: 450
A3: 學習階段  B3: 320
A4: 實作階段  B4: 180
A5: 精通階段  B5: 95
A6: 教學階段  B6: 42
```

---

### 11. AdoptionChart - 採用曲線數據

**用途**: 技術採用曲線分析

**欄位結構**:

| category | percentage |
|----------|------------|
| 創新者 | 2.5 |
| 早期採用者 | 13.5 |
| 早期大眾 | 34 |
| 晚期大眾 | 34 |
| 落後者 | 16 |

**欄位說明**:
- `category`: 採用者類別
- `percentage`: 百分比

**範例資料**:
```
A1: category    B1: percentage
A2: 創新者      B2: 2.5
A3: 早期採用者  B3: 13.5
A4: 早期大眾    B4: 34
A5: 晚期大眾    B5: 34
A6: 落後者      B6: 16
```

---

## 維護建議

### 資料更新頻率

- **Settings**: 按需更新
- **KPI**: 每日更新
- **QuickWins**: 每週更新
- **Risks**: 即時更新
- **Projects**: 每週更新
- **Resources**: 每月更新
- **Metrics**: 每月更新
- **Chart Data**: 每月更新

### 資料驗證規則

建議在 Google Sheet 中設定以下驗證規則：

1. **進度欄位**: 0-100 的數字
2. **日期欄位**: 日期格式驗證
3. **狀態欄位**: 下拉式選單
4. **probability/impact**: 限制為 low/med/high

### 備份建議

1. 定期匯出為 CSV 或 Excel 格式
2. 使用 Google Sheet 的版本歷史功能
3. 重要更新前建立副本

---

## 範本下載

完整的 Google Sheet 範本可以從以下連結複製：

（建議建立一個公開的範本試算表，並在此處提供連結）

---

## 疑難排解

### 問題：Apps Script 讀取不到資料

**解決方案**:
1. 檢查工作表名稱是否完全一致（區分大小寫）
2. 確認欄位結構是否正確
3. 檢查是否有空白列影響資料讀取

### 問題：日期格式錯誤

**解決方案**:
1. 確保日期格式為 YYYY-MM-DD
2. 在 Google Sheet 中設定儲存格格式為「純文字」或「日期」

### 問題：數字被當作文字

**解決方案**:
1. 確保數字欄位沒有多餘的空格
2. 設定儲存格格式為「數字」

---

## 相關文件

- [Google Apps Script](./GOOGLE_APPS_SCRIPT.md)
- [Integration Test](./INTEGRATION_TEST.md)
- [Data Schema](./DATA_SCHEMA.md)

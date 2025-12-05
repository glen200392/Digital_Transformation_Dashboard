# Google Sheet 工作表結構對照

本文件說明數位轉型儀表板與 Google Sheet 的工作表結構對應關係。

## 目錄

- [現有工作表對照](#現有工作表對照)
- [工作表詳細結構](#工作表詳細結構)
- [需要新增的工作表](#需要新增的工作表)
- [資料格式轉換](#資料格式轉換)
- [範例資料](#範例資料)

---

## 現有工作表對照

根據用戶的 Google Sheet ID: `1yyjwY2tDcV1_6mF8KjdkkEPz4jYGWWnIZIiWrbpNpfk`

| 現有工作表名稱 | 系統期望名稱 | 用途 | 狀態 |
|--------------|------------|------|-----|
| Config | Settings | 系統設定 | ✓ 已存在 |
| _AuditLog | AuditLog | 審計日誌 | ✓ 已存在 |
| KPI_Metrics | KPI | KPI 指標 | ✓ 已存在 |
| Projects | Projects | 專案列表 | ✓ 已存在 |
| Capability | Capability | 能力建設 | ✓ 已存在 |
| Change_Management | ChangeManagement | 變革管理 | ✓ 已存在 |
| Risk_Register | Risks | 風險登記 | ✓ 已存在 |
| QuickWins | QuickWins | 快速成效 | ⚠️ 可選（可從 Projects 篩選） |
| Resources | Resources | 資源配置 | ⚠️ 可選（可從 Config 讀取） |
| ChartData | ChartData | 圖表資料 | ⚠️ 可選（可從 Capability 計算） |

**說明**：
- ✓ 已存在：用戶的 Google Sheet 中已有此工作表
- ⚠️ 可選：可選擇性新增，不新增時系統會從其他工作表計算或使用預設值

---

## 工作表詳細結構

### 1. Config (設定)

**用途**：存儲系統設定和資源配置資訊

**欄位結構**（Key-Value 格式）：

| 欄位 A (key) | 欄位 B (value) | 說明 |
|-------------|---------------|------|
| total_budget | $2.5M | 總預算 |
| used_budget | $1.8M (72%) | 已使用預算 |
| total_headcount | 45 | 總人力 |
| allocated_headcount | 38 (84%) | 已配置人力 |

**範例**：

```
key                    | value
-----------------------|-------------
total_budget           | $2.5M
used_budget            | $1.8M (72%)
total_headcount        | 45
allocated_headcount    | 38 (84%)
system_version         | 2.0.0
last_update           | 2025-12-05
```

---

### 2. KPI_Metrics (KPI 指標)

**用途**：存儲關鍵績效指標資料

**欄位結構**：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| health_score | Number | 是 | 轉型健康度總分 (0-100) | 76 |
| health_trend | Text | 是 | 趨勢方向 | up/down/stable |
| roi | Number | 是 | 投資報酬率 (%) | 145 |
| progress | Number | 是 | 整體進度 (%) | 73 |
| engagement | Number | 是 | 員工參與度 (%) | 68 |
| update_date | Date | 否 | 更新日期 | 2025-12-05 |

**範例資料**：

```
health_score | health_trend | roi | progress | engagement | update_date
-------------|--------------|-----|----------|------------|-------------
76           | up           | 145 | 73       | 68         | 2025-12-05
```

**注意事項**：
- `high_risks` 不需要在此工作表，系統會自動從 Risk_Register 計算
- 健康度趨勢只接受：up、down、stable
- 所有百分比數值不需要加 % 符號，只填數字

---

### 3. Risk_Register (風險登記)

**用途**：記錄所有專案風險

**欄位結構**（從用戶截圖確認）：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| risk_id | Text | 是 | 風險唯一識別碼 | R001, R002... |
| risk_name | Text | 是 | 風險名稱 | 預算超支風險 |
| description | Text | 否 | 風險描述 | 可能因需求變更導致預算超支 |
| impact | Text | 是 | 影響程度 | High/Medium/Low |
| probability | Text | 是 | 發生機率 | High/Medium/Low |
| risk_level | Text | 否 | 風險等級 | 高風險/中風險/低風險 |
| owner | Text | 是 | 負責人 | 張三 |
| mitigation_plan | Text | 否 | 緩解計劃 | 每週檢視預算使用情況 |
| due_date | Date | 否 | 到期日 | 2025-12-31 |
| status | Text | 否 | 狀態 | 監控中/已緩解/已關閉 |

**範例資料**：

```
risk_id | risk_name      | description        | impact | probability | risk_level | owner | mitigation_plan      | due_date   | status
--------|----------------|-------------------|--------|-------------|-----------|-------|---------------------|-----------|--------
R001    | 預算超支風險    | 需求變更導致超支    | Medium | Low         | 中風險     | 張三   | 每週檢視預算         | 2025-12-31 | 監控中
R002    | 人才流失       | 關鍵人員可能離職    | High   | Medium      | 高風險     | 李四   | 加強培訓和留任計畫   | 2025-12-15 | 已緩解
R003    | 技術債務累積    | 舊系統維護困難      | Medium | Medium      | 中風險     | 王五   | 定期重構和代碼審查   | 2025-12-20 | 處理中
```

**資料格式轉換**：

系統會自動將以下格式轉換：
- `High` → `high`
- `Medium` → `med`
- `Low` → `low`

**高風險計算邏輯**：
- 高風險定義：`impact = "High" AND probability = "High"`
- 此數量會自動填入 `kpi.highRisks`

---

### 4. Projects (專案列表)

**用途**：記錄所有數位轉型專案

**欄位結構**：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| project_id | Text | 是 | 專案唯一識別碼 | P001, P002... |
| name / project_name | Text | 是 | 專案名稱 | 核心系統現代化 |
| department | Text | 是 | 負責部門 | IT 部門 |
| status | Text | 是 | 專案狀態 | 進行中/規劃中/已完成 |
| progress | Number | 是 | 進度 (0-100) | 65 |
| budget | Text | 是 | 預算 | $500K |
| timeline | Text | 是 | 時程 | Q1-Q4 2025 |
| priority | Text | 否 | 優先級 | high/medium/low |
| quick_win | Boolean | 否 | 是否為快速成效 | TRUE/FALSE 或 YES/NO 或 1/0 |
| owner | Text | 否 | 負責人 | 張三 |
| deadline / due_date | Date | 否 | 截止日期 | 2025-12-31 |

**範例資料**：

```
project_id | name           | department | status | progress | budget | timeline      | priority | quick_win | owner | deadline
-----------|----------------|-----------|--------|----------|--------|--------------|----------|-----------|-------|----------
P001       | 核心系統現代化   | IT        | 進行中  | 65       | $500K  | Q1-Q4 2025   | high     | FALSE     | 張三   | 2025-12-31
P002       | 客戶體驗優化     | 業務      | 進行中  | 78       | $300K  | Q2-Q3 2025   | medium   | TRUE      | 李四   | 2025-09-30
P003       | 數據分析平台     | 數據      | 進行中  | 52       | $450K  | Q1-Q3 2025   | high     | FALSE     | 王五   | 2025-09-30
P004       | 自動化報表系統   | IT        | 進行中  | 85       | $200K  | Q1 2025      | medium   | TRUE      | 趙六   | 2025-03-31
```

**Quick Wins 篩選邏輯**：
- 如果沒有獨立的 QuickWins 工作表，系統會自動篩選 `quick_win = TRUE` 的專案
- 接受的值：TRUE、YES、1、true、yes

---

### 5. Capability (能力建設)

**用途**：記錄各維度的能力成熟度

**欄位結構**：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| dimension / capability | Text | 是 | 能力維度名稱 | 策略規劃 |
| current / current_level | Number | 是 | 當前成熟度 (0-100) | 75 |
| target / target_level | Number | 是 | 目標成熟度 (0-100) | 85 |
| description | Text | 否 | 描述 | 制定清晰的數位轉型策略 |
| owner | Text | 否 | 負責人 | 李四 |

**範例資料**：

```
dimension  | current | target | description              | owner
-----------|---------|--------|-------------------------|-------
策略規劃    | 75      | 85     | 制定清晰的數位轉型策略     | 李四
流程優化    | 82      | 90     | 優化核心業務流程          | 張三
技術能力    | 68      | 85     | 提升技術團隊能力          | 王五
人才發展    | 71      | 85     | 培養數位人才             | 趙六
數據治理    | 79      | 90     | 建立完善的數據治理機制     | 錢七
創新文化    | 85      | 90     | 培養創新和實驗文化        | 孫八
```

**用途**：
- 自動生成雷達圖 (Radar Chart) 資料
- 如果有 ChartData 工作表，則優先使用該工作表的資料

---

### 6. _AuditLog (審計日誌)

**用途**：記錄所有 API 請求和系統操作

**欄位結構**：

| 欄位名稱 | 資料類型 | 說明 | 範例值 |
|---------|---------|------|--------|
| timestamp | DateTime | 操作時間 | 2025-12-05 10:30:00 |
| user | Text | 操作用戶 | user@example.com |
| action | Text | 操作類型 | API_REQUEST |
| details | Text | 詳細資訊 | endpoint: full |

**範例資料**：

```
timestamp           | user              | action      | details
--------------------|-------------------|-------------|------------------
2025-12-05 10:30:00 | user@example.com  | API_REQUEST | endpoint: full
2025-12-05 10:31:15 | user@example.com  | API_REQUEST | endpoint: kpi
2025-12-05 10:32:30 | admin@example.com | DATA_UPDATE | sheet: KPI_Metrics
```

**注意事項**：
- 此工作表由系統自動寫入，不需要手動維護
- 如果權限不足，API 不會因為無法寫入日誌而失敗

---

## 需要新增的工作表

以下工作表為可選，如果不新增，系統會使用其他方式取得資料。

### 1. QuickWins (快速成效)

**用途**：獨立管理快速成效項目

**何時需要**：
- 當 Quick Wins 資料不在 Projects 工作表中
- 當需要更詳細的 Quick Wins 管理

**欄位結構**：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| id | Text | 是 | 唯一識別碼 | QW001 |
| title | Text | 是 | 項目名稱 | 自動化報表系統 |
| owner | Text | 是 | 負責人 | IT 部門 |
| deadline | Date | 是 | 截止日期 | 2025-12-15 |
| progress | Number | 是 | 進度 (0-100) | 85 |
| status | Text | 否 | 狀態 | in_progress/completed/delayed |

**範例資料**：

```
id    | title           | owner      | deadline   | progress | status
------|----------------|-----------|-----------|----------|-------------
QW001 | 自動化報表系統   | IT 部門    | 2025-12-15 | 85       | in_progress
QW002 | 線上協作平台導入 | 人資部     | 2025-12-20 | 72       | in_progress
QW003 | 客戶自助服務入口 | 客服部     | 2025-12-25 | 58       | in_progress
QW004 | 數據視覺化儀表板 | 數據分析組 | 2025-12-30 | 45       | in_progress
```

**建立方式**：
1. 在 Google Sheet 中新增工作表，命名為 `QuickWins`
2. 第一行輸入欄位名稱（如上表）
3. 從第二行開始輸入資料

---

### 2. Resources (資源配置)

**用途**：獨立管理資源配置資訊

**何時需要**：
- 當 Config 工作表沒有資源配置資訊
- 當需要更詳細的資源管理

**欄位結構**（Key-Value 格式）：

| 欄位名稱 | 資料類型 | 必要 | 說明 | 範例值 |
|---------|---------|------|------|--------|
| key | Text | 是 | 資源項目 | total_budget |
| value | Text/Number | 是 | 數值 | $2.5M |

**範例資料**：

```
key                    | value
-----------------------|-------------
total_budget           | $2.5M
used_budget            | $1.8M (72%)
total_headcount        | 45
allocated_headcount    | 38 (84%)
```

**建立方式**：
1. 在 Google Sheet 中新增工作表，命名為 `Resources`
2. 第一欄輸入 key，第二欄輸入 value
3. 不需要標題行，直接從第一行開始輸入資料

---

### 3. ChartData (圖表資料)

**用途**：自訂圖表資料（燃盡圖、漏斗圖、採用曲線圖）

**何時需要**：
- 當需要自訂圖表資料而不是使用預設值

**欄位結構**：

此工作表結構較複雜，建議使用預設值或從 Capability 計算。

如果要自訂，可以參考 `data/fallback.json` 的 `charts` 結構。

---

## 資料格式轉換

### 風險等級轉換

**Google Sheet 格式** → **API 格式**

| Sheet 格式 | API 格式 |
|-----------|---------|
| High | high |
| Medium | med |
| Low | low |
| HIGH | high |
| MEDIUM | med |
| LOW | low |

**轉換規則**：
- 不區分大小寫
- 自動轉換為小寫
- Medium 轉換為 med

### 日期格式

**Google Sheet 支援格式**：
- `2025-12-31` (ISO 8601)
- `12/31/2025`
- `2025/12/31`
- Google Sheets 的 Date 物件

**API 輸出格式**：
- 統一為 `YYYY-MM-DD` (ISO 8601)

### 布林值轉換

**Quick Wins 判斷**：

| Sheet 格式 | 判斷結果 |
|-----------|---------|
| TRUE | ✓ 是 Quick Win |
| YES | ✓ 是 Quick Win |
| 1 | ✓ 是 Quick Win |
| true | ✓ 是 Quick Win |
| yes | ✓ 是 Quick Win |
| FALSE | ✗ 不是 Quick Win |
| NO | ✗ 不是 Quick Win |
| 0 | ✗ 不是 Quick Win |
| (空白) | ✗ 不是 Quick Win |

---

## 範例資料

### 完整的 Google Sheet 範例

**工作表 1: Config**
```
key                    | value
-----------------------|-------------
total_budget           | $2.5M
used_budget            | $1.8M (72%)
total_headcount        | 45
allocated_headcount    | 38 (84%)
```

**工作表 2: KPI_Metrics**
```
health_score | health_trend | roi | progress | engagement | update_date
-------------|--------------|-----|----------|------------|-------------
76           | up           | 145 | 73       | 68         | 2025-12-05
```

**工作表 3: Risk_Register**
```
risk_id | risk_name      | description    | impact | probability | risk_level | owner | mitigation_plan  | due_date   | status
--------|----------------|---------------|--------|-------------|-----------|-------|-----------------|-----------|--------
R001    | 預算超支風險    | 需求變更       | Medium | Low         | 中風險     | 張三   | 每週檢視預算     | 2025-12-31 | 監控中
R002    | 人才流失       | 關鍵人員離職    | High   | Medium      | 高風險     | 李四   | 加強培訓        | 2025-12-15 | 已緩解
```

**工作表 4: Projects**
```
project_id | name         | department | status | progress | budget | timeline    | priority | quick_win
-----------|-------------|-----------|--------|----------|--------|------------|----------|----------
P001       | 核心系統現代化 | IT        | 進行中  | 65       | $500K  | Q1-Q4 2025 | high     | FALSE
P002       | 客戶體驗優化   | 業務      | 進行中  | 78       | $300K  | Q2-Q3 2025 | medium   | TRUE
```

**工作表 5: Capability**
```
dimension  | current | target | description
-----------|---------|--------|------------
策略規劃    | 75      | 85     | 制定清晰的數位轉型策略
流程優化    | 82      | 90     | 優化核心業務流程
技術能力    | 68      | 85     | 提升技術團隊能力
人才發展    | 71      | 85     | 培養數位人才
數據治理    | 79      | 90     | 建立完善的數據治理機制
創新文化    | 85      | 90     | 培養創新和實驗文化
```

---

## 常見問題

### Q1: 工作表名稱必須完全一樣嗎？

A: 是的，Google Apps Script 使用工作表名稱來識別資料，必須完全一致（包括大小寫）。

### Q2: 可以新增額外的欄位嗎？

A: 可以，系統只會讀取需要的欄位，額外的欄位會被忽略。

### Q3: 欄位順序重要嗎？

A: 不重要，系統使用欄位名稱（第一行）來識別資料，不依賴順序。

### Q4: 如果缺少某些欄位會怎樣？

A: 系統會使用預設值或空值，不會導致錯誤。

### Q5: 資料可以留空嗎？

A: 必要欄位不能留空，可選欄位可以留空。參考各工作表的「必要」欄位。

---

**文件版本**: 1.0.0  
**最後更新**: 2025-12-05  
**維護者**: Digital Transformation Team

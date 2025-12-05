# 資料結構定義 (Data Schema)

本文件定義數位轉型儀表板的完整資料結構。

## 目錄

- [完整 JSON Schema](#完整-json-schema)
- [KPI 資料結構](#kpi-資料結構)
- [Quick Wins 資料結構](#quick-wins-資料結構)
- [專案資料結構](#專案資料結構)
- [風險資料結構](#風險資料結構)
- [圖表資料結構](#圖表資料結構)
- [資源資料結構](#資源資料結構)
- [指標資料結構](#指標資料結構)
- [範例資料](#範例資料)

---

## 完整 JSON Schema

```json
{
  "kpi": {
    "type": "object",
    "required": true,
    "description": "關鍵績效指標"
  },
  "quickWins": {
    "type": "array",
    "required": false,
    "description": "快速成效項目列表"
  },
  "projects": {
    "type": "array",
    "required": false,
    "description": "專案列表"
  },
  "risks": {
    "type": "array",
    "required": false,
    "description": "風險列表"
  },
  "resources": {
    "type": "object",
    "required": false,
    "description": "資源配置資訊"
  },
  "metrics": {
    "type": "object",
    "required": false,
    "description": "關鍵成功指標"
  },
  "charts": {
    "type": "object",
    "required": false,
    "description": "圖表資料"
  }
}
```

---

## KPI 資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `healthScore` | number | 是 | 轉型健康度總分 (0-100) | 76 |
| `healthTrend` | string | 否 | 趨勢方向 | "up", "down", "stable" |
| `roi` | number | 是 | 投資報酬率 (%) | 145 |
| `progress` | number | 是 | 整體進度 (%) | 73 |
| `engagement` | number | 是 | 員工參與度 (%) | 68 |
| `highRisks` | number | 是 | 高風險項目數量 | 0 |

### 範例

```json
{
  "kpi": {
    "healthScore": 76,
    "healthTrend": "up",
    "roi": 145,
    "progress": 73,
    "engagement": 68,
    "highRisks": 0
  }
}
```

### 驗證規則

- `healthScore`: 0 ≤ value ≤ 100
- `roi`: value ≥ 0
- `progress`: 0 ≤ value ≤ 100
- `engagement`: 0 ≤ value ≤ 100
- `highRisks`: value ≥ 0 (整數)
- `healthTrend`: "up" | "down" | "stable"

---

## Quick Wins 資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `id` | string | 是 | 唯一識別碼 | "qw-001" |
| `title` | string | 是 | 項目名稱 | "雲端遷移" |
| `owner` | string | 是 | 負責人 | "IT部門" |
| `deadline` | string | 是 | 截止日期 | "2025-01-15" |
| `progress` | number | 是 | 進度 (%) | 85 |
| `status` | string | 否 | 狀態 | "in_progress", "completed", "delayed" |

### 範例

```json
{
  "quickWins": [
    {
      "id": "qw-001",
      "title": "雲端基礎設施遷移",
      "owner": "IT部門",
      "deadline": "2025-01-15",
      "progress": 85,
      "status": "in_progress"
    },
    {
      "id": "qw-002",
      "title": "自動化報表系統",
      "owner": "數據團隊",
      "deadline": "2025-01-30",
      "progress": 60,
      "status": "in_progress"
    }
  ]
}
```

### 驗證規則

- `id`: 不可為空，建議使用前綴 + 序號格式
- `title`: 最大長度 100 字元
- `owner`: 最大長度 50 字元
- `deadline`: ISO 8601 日期格式 (YYYY-MM-DD)
- `progress`: 0 ≤ value ≤ 100
- `status`: "in_progress" | "completed" | "delayed" | "blocked"

---

## 專案資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `id` | string | 是 | 唯一識別碼 | "proj-001" |
| `name` | string | 是 | 專案名稱 | "CRM 系統升級" |
| `department` | string | 是 | 負責部門 | "業務部" |
| `status` | string | 是 | 狀態 | "進行中" |
| `progress` | number | 是 | 進度 (%) | 75 |
| `budget` | string | 是 | 預算 | "$500K" |
| `timeline` | string | 是 | 時程 | "Q1 2025" |
| `priority` | string | 否 | 優先級 | "high", "medium", "low" |

### 範例

```json
{
  "projects": [
    {
      "id": "proj-001",
      "name": "CRM 系統升級",
      "department": "業務部",
      "status": "進行中",
      "progress": 75,
      "budget": "$500K",
      "timeline": "Q1 2025",
      "priority": "high"
    }
  ]
}
```

### 驗證規則

- `name`: 最大長度 100 字元
- `department`: 最大長度 50 字元
- `progress`: 0 ≤ value ≤ 100
- `priority`: "high" | "medium" | "low"

---

## 風險資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `id` | string | 是 | 唯一識別碼 | "risk-001" |
| `title` | string | 是 | 風險名稱 | "人員流失" |
| `probability` | string | 是 | 發生機率 | "high", "med", "low" |
| `impact` | string | 是 | 影響程度 | "high", "med", "low" |
| `status` | string | 否 | 狀態 | "active", "mitigated", "closed" |
| `mitigation` | string | 否 | 緩解措施 | "加強培訓" |

### 範例

```json
{
  "risks": [
    {
      "id": "risk-001",
      "title": "關鍵人員流失風險",
      "probability": "med",
      "impact": "high",
      "status": "active",
      "mitigation": "加強員工培訓和留任計畫"
    },
    {
      "id": "risk-002",
      "title": "技術債務累積",
      "probability": "low",
      "impact": "med",
      "status": "mitigated",
      "mitigation": "定期重構和代碼審查"
    }
  ]
}
```

### 驗證規則

- `probability`: "high" | "med" | "low"
- `impact`: "high" | "med" | "low"
- `status`: "active" | "mitigated" | "closed"
- `title`: 最大長度 100 字元

### 風險矩陣對應

風險會根據 `probability` 和 `impact` 的組合顯示在熱力圖中：

| Impact \ Probability | Low | Med | High |
|---------------------|-----|-----|------|
| **High** | 🟡 中度風險 | 🟠 高度風險 | 🔴 極高風險 |
| **Med** | 🟢 低度風險 | 🟡 中度風險 | 🟠 高度風險 |
| **Low** | 🟢 低度風險 | 🟢 低度風險 | 🟡 中度風險 |

---

## 圖表資料結構

### Radar Chart (轉型成熟度雷達圖)

```json
{
  "charts": {
    "radar": {
      "labels": ["技術", "流程", "人才", "文化", "數據"],
      "values": [75, 68, 82, 60, 70]
    }
  }
}
```

**驗證規則**:
- `labels`: 陣列長度 3-8
- `values`: 陣列長度必須與 labels 相同，每個值 0-100

### Burndown Chart (燃盡圖)

```json
{
  "charts": {
    "burndown": {
      "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
      "planned": [100, 75, 50, 25],
      "actual": [100, 80, 55, 30]
    }
  }
}
```

**驗證規則**:
- `labels`, `planned`, `actual`: 長度必須相同
- `planned`, `actual`: 數值遞減

### Funnel Chart (漏斗圖)

```json
{
  "charts": {
    "funnel": {
      "labels": ["認知", "理解", "採用", "精通"],
      "values": [1000, 750, 500, 300]
    }
  }
}
```

**驗證規則**:
- `values`: 數值應遞減（漏斗形狀）

### Adoption Chart (採用曲線圖)

```json
{
  "charts": {
    "adoption": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "datasets": [
        {
          "label": "實際採用率",
          "data": [20, 35, 48, 60, 67]
        },
        {
          "label": "目標採用率",
          "data": [25, 40, 55, 70, 75]
        }
      ]
    }
  }
}
```

---

## 資源資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `totalBudget` | string | 是 | 總預算 | "$2.5M" |
| `usedBudget` | string | 是 | 已使用預算 | "$1.8M" |
| `totalHeadcount` | number | 是 | 總人力 | 45 |
| `allocatedHeadcount` | number | 是 | 已配置人力 | 38 |

### 範例

```json
{
  "resources": {
    "totalBudget": "$2.5M",
    "usedBudget": "$1.8M",
    "totalHeadcount": 45,
    "allocatedHeadcount": 38
  }
}
```

---

## 指標資料結構

### Schema

| 欄位 | 類型 | 必要 | 說明 | 範例值 |
|------|------|------|------|--------|
| `adoption` | string | 是 | 技術採用率 | "67%" |
| `satisfaction` | string | 是 | 用戶滿意度 | "4.2" |
| `efficiency` | string | 是 | 效率提升 | "+28%" |

### 範例

```json
{
  "metrics": {
    "adoption": "67%",
    "satisfaction": "4.2",
    "efficiency": "+28%"
  }
}
```

---

## 範例資料

### 完整的 API 回應範例

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
  "quickWins": [
    {
      "id": "qw-001",
      "title": "雲端基礎設施遷移",
      "owner": "IT部門",
      "deadline": "2025-01-15",
      "progress": 85,
      "status": "in_progress"
    },
    {
      "id": "qw-002",
      "title": "自動化報表系統",
      "owner": "數據團隊",
      "deadline": "2025-01-30",
      "progress": 60,
      "status": "in_progress"
    }
  ],
  "projects": [
    {
      "id": "proj-001",
      "name": "CRM 系統升級",
      "department": "業務部",
      "status": "進行中",
      "progress": 75,
      "budget": "$500K",
      "timeline": "Q1 2025",
      "priority": "high"
    },
    {
      "id": "proj-002",
      "name": "數據分析平台",
      "department": "數據部",
      "status": "進行中",
      "progress": 60,
      "budget": "$800K",
      "timeline": "Q2 2025",
      "priority": "high"
    }
  ],
  "risks": [
    {
      "id": "risk-001",
      "title": "關鍵人員流失風險",
      "probability": "med",
      "impact": "high",
      "status": "active",
      "mitigation": "加強員工培訓和留任計畫"
    }
  ],
  "resources": {
    "totalBudget": "$2.5M",
    "usedBudget": "$1.8M",
    "totalHeadcount": 45,
    "allocatedHeadcount": 38
  },
  "metrics": {
    "adoption": "67%",
    "satisfaction": "4.2",
    "efficiency": "+28%"
  },
  "charts": {
    "radar": {
      "labels": ["技術", "流程", "人才", "文化", "數據"],
      "values": [75, 68, 82, 60, 70]
    },
    "burndown": {
      "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
      "planned": [100, 75, 50, 25],
      "actual": [100, 80, 55, 30]
    },
    "funnel": {
      "labels": ["認知", "理解", "採用", "精通"],
      "values": [1000, 750, 500, 300]
    },
    "adoption": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "datasets": [
        {
          "label": "實際採用率",
          "data": [20, 35, 48, 60, 67]
        },
        {
          "label": "目標採用率",
          "data": [25, 40, 55, 70, 75]
        }
      ]
    }
  }
}
```

---

## 資料驗證

### JavaScript 驗證函數

```javascript
function validateDashboardData(data) {
    // 檢查必要欄位
    if (!data.kpi) {
        throw new Error('缺少必要欄位: kpi');
    }
    
    // 驗證 KPI 數值範圍
    if (data.kpi.healthScore < 0 || data.kpi.healthScore > 100) {
        throw new Error('healthScore 必須在 0-100 之間');
    }
    
    // 驗證陣列欄位
    if (data.quickWins && !Array.isArray(data.quickWins)) {
        throw new Error('quickWins 必須是陣列');
    }
    
    // 驗證風險資料
    if (data.risks) {
        data.risks.forEach(risk => {
            if (!['high', 'med', 'low'].includes(risk.probability)) {
                throw new Error('無效的風險機率值');
            }
            if (!['high', 'med', 'low'].includes(risk.impact)) {
                throw new Error('無效的風險影響值');
            }
        });
    }
    
    return true;
}
```

---

## 版本管理

### 資料版本

當前 Schema 版本: **2.1.0**

### 版本兼容性

- **v2.x**: 向後兼容 v2.0
- **v1.x**: 不兼容，需要資料遷移

---

**文件版本**: 2.1.0  
**最後更新**: 2025-12-05  
**維護者**: Digital Transformation Team

/**
 * ============================================================
 * 數位轉型儀表板 - Google Apps Script API v2.0
 * 
 * 此腳本用於將 Google Sheet 資料轉換為儀表板所需的 JSON 格式
 * 並通過 Web App 提供 API 端點
 * 
 * 部署方式:
 * 1. 在 Google Apps Script 編輯器中建立新專案
 * 2. 複製此腳本內容
 * 3. 修改 SHEET_ID 為您的 Google Sheet ID
 * 4. 部署為 Web App，設定為「任何人都可存取」
 * 5. 複製 Web App URL 並設定到前端 CONFIG.api.endpoint
 * 
 * 版本: 2.0.0
 * 最後更新: 2025-12-05
 * ============================================================
 */

// ==================== 設定區 ====================

// Google Sheet ID - 請替換為您的 Sheet ID
const SHEET_ID = '1yyjwY2tDcV1_6mF8KjdkkEPz4jYGWWnIZIiWrbpNpfk';

// 工作表名稱對照（對應用戶現有的工作表）
const SHEET_NAMES = {
  CONFIG: 'Config',              // 設定工作表
  AUDIT_LOG: '_AuditLog',        // 審計日誌
  KPI: 'KPI_Metrics',            // KPI 指標
  PROJECTS: 'Projects',          // 專案列表
  CAPABILITY: 'Capability',      // 能力建設
  CHANGE_MGMT: 'Change_Management', // 變革管理
  RISKS: 'Risk_Register',        // 風險登記
  QUICK_WINS: 'QuickWins',       // Quick Wins（可選，如不存在則從 Projects 篩選）
  RESOURCES: 'Resources',        // 資源配置（可選，如不存在則從 Config 讀取）
  CHART_DATA: 'ChartData'        // 圖表資料（可選，如不存在則從 Capability 計算）
};

// ==================== 主要 API 端點 ====================

/**
 * doGet - 處理 HTTP GET 請求
 * 這是 Google Apps Script Web App 的入口函數
 */
function doGet(e) {
  try {
    // 解析請求參數
    const params = e.parameter || {};
    const endpoint = params.endpoint || 'full';
    
    // 記錄請求（如果有 Audit Log 工作表）
    logRequest(endpoint);
    
    let result;
    
    // 根據 endpoint 返回不同資料
    switch (endpoint) {
      case 'full':
        result = getFullData();
        break;
      case 'kpi':
        result = getKPI();
        break;
      case 'risks':
        result = getRisks();
        break;
      case 'projects':
        result = getProjects();
        break;
      case 'quickwins':
        result = getQuickWins();
        break;
      case 'capability':
        result = getCapability();
        break;
      case 'resources':
        result = getResources();
        break;
      case 'charts':
        result = getChartData();
        break;
      default:
        result = { error: '未知的 endpoint: ' + endpoint };
    }
    
    // 返回 JSON 回應（支援 CORS）
    return createJSONResponse(result);
    
  } catch (error) {
    // 錯誤處理
    console.error('API 錯誤:', error);
    return createJSONResponse({
      error: error.message || '伺服器錯誤',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 建立 JSON 回應（支援 CORS）
 */
function createJSONResponse(data) {
  const json = JSON.stringify(data, null, 2);
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== 資料擷取函數 ====================

/**
 * getFullData - 取得完整儀表板資料
 * 返回所有 Layer 所需的完整資料結構
 */
function getFullData() {
  try {
    // 先讀取風險資料，避免在 getKPI 中重複讀取
    const risks = getRisks();
    const kpi = getKPI(risks);
    const quickWins = getQuickWins();
    const projects = getProjects();
    const resources = getResources();
    const metrics = getMetrics();
    const charts = getChartData();
    
    return {
      kpi: kpi,
      quickWins: quickWins,
      risks: risks,
      projects: projects,
      resources: resources,
      metrics: metrics,
      charts: charts,
      metadata: {
        version: '2.0.0',
        lastUpdate: new Date().toISOString(),
        source: 'google_sheets',
        sheetId: SHEET_ID
      }
    };
  } catch (error) {
    console.error('getFullData 錯誤:', error);
    throw new Error('無法載入完整資料: ' + error.message);
  }
}

/**
 * getKPI - 從 KPI_Metrics 工作表讀取 KPI 資料
 * 返回 Layer 1 所需的 KPI 資料
 * 
 * @param {Array} cachedRisks - 可選的快取風險資料，避免重複讀取
 */
function getKPI(cachedRisks) {
  try {
    const sheet = getSheet(SHEET_NAMES.KPI);
    if (!sheet) {
      console.warn('找不到 KPI_Metrics 工作表，使用預設值');
      return getDefaultKPI();
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 假設第二行是當前數據
    const row = data[1] || [];
    
    // 建立欄位索引對照
    const getColumnValue = (columnName, defaultValue = 0) => {
      const index = headers.indexOf(columnName);
      return index >= 0 ? (row[index] || defaultValue) : defaultValue;
    };
    
    // 計算高風險數量 - 使用快取的風險資料或重新讀取
    const risks = cachedRisks || getRisks();
    const highRisks = risks.filter(r => 
      r.probability === 'high' && r.impact === 'high'
    ).length;
    
    return {
      healthScore: parseInt(getColumnValue('health_score', 76)),
      healthTrend: getColumnValue('health_trend', 'up'),
      roi: parseInt(getColumnValue('roi', 145)),
      progress: parseInt(getColumnValue('progress', 73)),
      engagement: parseInt(getColumnValue('engagement', 68)),
      highRisks: highRisks
    };
  } catch (error) {
    console.error('getKPI 錯誤:', error);
    return getDefaultKPI();
  }
}

/**
 * getRisks - 從 Risk_Register 工作表讀取風險資料
 * 並轉換格式為前端所需格式
 */
function getRisks() {
  try {
    const sheet = getSheet(SHEET_NAMES.RISKS);
    if (!sheet) {
      console.warn('找不到 Risk_Register 工作表');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 建立欄位索引對照
    const indices = {
      risk_id: headers.indexOf('risk_id'),
      risk_name: headers.indexOf('risk_name'),
      description: headers.indexOf('description'),
      impact: headers.indexOf('impact'),
      probability: headers.indexOf('probability'),
      risk_level: headers.indexOf('risk_level'),
      owner: headers.indexOf('owner'),
      mitigation_plan: headers.indexOf('mitigation_plan'),
      due_date: headers.indexOf('due_date'),
      status: headers.indexOf('status')
    };
    
    const risks = [];
    
    // 從第二行開始讀取資料（跳過標題）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 跳過空行
      if (!row[indices.risk_id]) continue;
      
      // 轉換格式：High -> high, Medium -> med, Low -> low
      const convertLevel = (value) => {
        if (!value) return 'low';
        const val = value.toString().trim().toLowerCase();
        // 使用精確匹配避免誤判
        if (val === 'high') return 'high';
        if (val === 'medium' || val === 'med') return 'med';
        if (val === 'low') return 'low';
        // 降級處理：如果不是標準值，使用包含匹配
        if (val.indexOf('high') === 0) return 'high';
        if (val.indexOf('med') === 0 || val.indexOf('medium') === 0) return 'med';
        return 'low';
      };
      
      risks.push({
        id: i,
        title: row[indices.risk_name] || '',
        probability: convertLevel(row[indices.probability]),
        impact: convertLevel(row[indices.impact]),
        status: row[indices.status] || '監控中',
        description: row[indices.description] || '',
        owner: row[indices.owner] || '',
        mitigation: row[indices.mitigation_plan] || '',
        dueDate: formatDate(row[indices.due_date])
      });
    }
    
    return risks;
  } catch (error) {
    console.error('getRisks 錯誤:', error);
    return [];
  }
}

/**
 * getProjects - 從 Projects 工作表讀取專案資料
 */
function getProjects() {
  try {
    const sheet = getSheet(SHEET_NAMES.PROJECTS);
    if (!sheet) {
      console.warn('找不到 Projects 工作表');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 輔助函數：查找欄位索引，支援備選欄位名稱
    const findColumnIndex = (primaryName, fallbackName) => {
      const primaryIndex = headers.indexOf(primaryName);
      if (primaryIndex >= 0) return primaryIndex;
      return fallbackName ? headers.indexOf(fallbackName) : -1;
    };
    
    // 建立欄位索引對照
    const indices = {
      project_id: findColumnIndex('project_id'),
      name: findColumnIndex('name', 'project_name'),
      department: findColumnIndex('department'),
      status: findColumnIndex('status'),
      progress: findColumnIndex('progress'),
      budget: findColumnIndex('budget'),
      timeline: findColumnIndex('timeline'),
      priority: findColumnIndex('priority'),
      quick_win: findColumnIndex('quick_win')
    };
    
    const projects = [];
    
    // 從第二行開始讀取資料
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 跳過空行
      if (!row[indices.project_id] && !row[indices.name]) continue;
      
      projects.push({
        id: row[indices.project_id] || i,
        name: row[indices.name] || '',
        department: row[indices.department] || '',
        status: row[indices.status] || '進行中',
        progress: parseInt(row[indices.progress]) || 0,
        budget: row[indices.budget] || '$0',
        timeline: row[indices.timeline] || '',
        priority: row[indices.priority] || 'medium'
      });
    }
    
    return projects;
  } catch (error) {
    console.error('getProjects 錯誤:', error);
    return [];
  }
}

/**
 * getQuickWins - 取得 Quick Wins 資料
 * 優先從 QuickWins 工作表讀取，如不存在則從 Projects 篩選
 */
function getQuickWins() {
  try {
    // 嘗試從 QuickWins 工作表讀取
    const sheet = getSheet(SHEET_NAMES.QUICK_WINS);
    
    if (sheet) {
      return getQuickWinsFromSheet(sheet);
    } else {
      // 從 Projects 工作表篩選 quick_win = true 的項目
      return getQuickWinsFromProjects();
    }
  } catch (error) {
    console.error('getQuickWins 錯誤:', error);
    return [];
  }
}

/**
 * 從 QuickWins 工作表讀取
 */
function getQuickWinsFromSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const indices = {
    id: headers.indexOf('id'),
    title: headers.indexOf('title'),
    owner: headers.indexOf('owner'),
    deadline: headers.indexOf('deadline'),
    progress: headers.indexOf('progress'),
    status: headers.indexOf('status')
  };
  
  const quickWins = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[indices.title]) continue;
    
    quickWins.push({
      id: row[indices.id] || `qw-${i}`,
      title: row[indices.title] || '',
      owner: row[indices.owner] || '',
      deadline: formatDate(row[indices.deadline]),
      progress: parseInt(row[indices.progress]) || 0,
      status: row[indices.status] || 'in_progress'
    });
  }
  
  return quickWins;
}

/**
 * 從 Projects 工作表篩選 Quick Wins
 */
function getQuickWinsFromProjects() {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // 輔助函數：查找欄位索引，支援備選欄位名稱
  const findColumnIndex = (primaryName, fallbackName) => {
    const primaryIndex = headers.indexOf(primaryName);
    if (primaryIndex >= 0) return primaryIndex;
    return fallbackName ? headers.indexOf(fallbackName) : -1;
  };
  
  const indices = {
    project_id: findColumnIndex('project_id'),
    name: findColumnIndex('name', 'project_name'),
    owner: findColumnIndex('owner', 'department'),
    deadline: findColumnIndex('deadline', 'due_date'),
    progress: findColumnIndex('progress'),
    quick_win: findColumnIndex('quick_win')
  };
  
  const quickWins = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // 篩選條件：quick_win = true 或 YES 或 1
    const isQuickWin = row[indices.quick_win];
    if (!isQuickWin) continue;
    
    // 處理布林值和字串
    let isQuickWinFlag = false;
    if (typeof isQuickWin === 'boolean') {
      isQuickWinFlag = isQuickWin;
    } else {
      const quickWinValue = isQuickWin.toString().trim().toLowerCase();
      isQuickWinFlag = (quickWinValue === 'true' || quickWinValue === 'yes' || quickWinValue === '1');
    }
    
    if (isQuickWinFlag) {
      quickWins.push({
        id: row[indices.project_id] || `qw-${i}`,
        title: row[indices.name] || '',
        owner: row[indices.owner] || '',
        deadline: formatDate(row[indices.deadline]),
        progress: parseInt(row[indices.progress]) || 0
      });
    }
  }
  
  return quickWins;
}

/**
 * getCapability - 從 Capability 工作表讀取能力建設資料
 */
function getCapability() {
  try {
    const sheet = getSheet(SHEET_NAMES.CAPABILITY);
    if (!sheet) {
      console.warn('找不到 Capability 工作表');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 輔助函數：查找欄位索引，支援備選欄位名稱
    const findColumnIndex = (primaryName, fallbackName) => {
      const primaryIndex = headers.indexOf(primaryName);
      if (primaryIndex >= 0) return primaryIndex;
      return fallbackName ? headers.indexOf(fallbackName) : -1;
    };
    
    const indices = {
      dimension: findColumnIndex('dimension', 'capability'),
      current: findColumnIndex('current', 'current_level'),
      target: findColumnIndex('target', 'target_level')
    };
    
    const capabilities = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[indices.dimension]) continue;
      
      capabilities.push({
        dimension: row[indices.dimension] || '',
        current: parseInt(row[indices.current]) || 0,
        target: parseInt(row[indices.target]) || 0
      });
    }
    
    return capabilities;
  } catch (error) {
    console.error('getCapability 錯誤:', error);
    return [];
  }
}

/**
 * getResources - 取得資源配置資料
 * 優先從 Resources 工作表讀取，否則從 Config 讀取
 */
function getResources() {
  try {
    // 嘗試從 Resources 工作表讀取
    const sheet = getSheet(SHEET_NAMES.RESOURCES);
    
    if (sheet) {
      return getResourcesFromSheet(sheet);
    } else {
      // 從 Config 工作表讀取
      return getResourcesFromConfig();
    }
  } catch (error) {
    console.error('getResources 錯誤:', error);
    return getDefaultResources();
  }
}

/**
 * 從 Resources 工作表讀取
 */
function getResourcesFromSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  
  // 假設格式為 key-value 對
  // 第一欄是 key，第二欄是 value
  const resources = {
    totalBudget: '$2.5M',
    usedBudget: '$1.8M (72%)',
    totalHeadcount: 45,
    allocatedHeadcount: '38 (84%)'
  };
  
  for (let i = 1; i < data.length; i++) {
    const [key, value] = data[i];
    if (key && value) {
      const keyStr = key.toString().toLowerCase();
      if (keyStr.includes('total') && keyStr.includes('budget')) {
        resources.totalBudget = value.toString();
      } else if (keyStr.includes('used') && keyStr.includes('budget')) {
        resources.usedBudget = value.toString();
      } else if (keyStr.includes('total') && keyStr.includes('headcount')) {
        resources.totalHeadcount = parseInt(value) || value;
      } else if (keyStr.includes('allocated') && keyStr.includes('headcount')) {
        resources.allocatedHeadcount = value.toString();
      }
    }
  }
  
  return resources;
}

/**
 * 從 Config 工作表讀取資源資料
 */
function getResourcesFromConfig() {
  const sheet = getSheet(SHEET_NAMES.CONFIG);
  if (!sheet) return getDefaultResources();
  
  const data = sheet.getDataRange().getValues();
  
  const resources = {
    totalBudget: '$2.5M',
    usedBudget: '$1.8M (72%)',
    totalHeadcount: 45,
    allocatedHeadcount: '38 (84%)'
  };
  
  // 從 Config 中查找資源相關設定
  for (let i = 0; i < data.length; i++) {
    const [key, value] = data[i];
    if (!key || !value) continue;
    
    const keyStr = key.toString().toLowerCase();
    if (keyStr.includes('budget') && keyStr.includes('total')) {
      resources.totalBudget = value.toString();
    } else if (keyStr.includes('budget') && keyStr.includes('used')) {
      resources.usedBudget = value.toString();
    } else if (keyStr.includes('headcount') && keyStr.includes('total')) {
      resources.totalHeadcount = parseInt(value) || value;
    } else if (keyStr.includes('headcount') && keyStr.includes('allocated')) {
      resources.allocatedHeadcount = value.toString();
    }
  }
  
  return resources;
}

/**
 * getMetrics - 取得關鍵指標資料
 */
function getMetrics() {
  try {
    // 可以從 Config 或獨立的 Metrics 工作表讀取
    // 這裡提供預設值，您可以根據實際需求調整
    return {
      adoption: '67%',
      satisfaction: '4.2/5',
      efficiency: '+28%'
    };
  } catch (error) {
    console.error('getMetrics 錯誤:', error);
    return {
      adoption: '67%',
      satisfaction: '4.2/5',
      efficiency: '+28%'
    };
  }
}

/**
 * getChartData - 取得圖表資料
 * 優先從 ChartData 工作表讀取，否則從 Capability 計算
 */
function getChartData() {
  try {
    const sheet = getSheet(SHEET_NAMES.CHART_DATA);
    
    if (sheet) {
      return getChartDataFromSheet(sheet);
    } else {
      return generateChartDataFromCapability();
    }
  } catch (error) {
    console.error('getChartData 錯誤:', error);
    return getDefaultChartData();
  }
}

/**
 * 從 ChartData 工作表讀取圖表資料
 */
function getChartDataFromSheet(sheet) {
  // 此函數可根據 ChartData 工作表的實際格式實作
  // 目前返回預設結構
  return getDefaultChartData();
}

/**
 * 從 Capability 資料生成雷達圖
 */
function generateChartDataFromCapability() {
  const capabilities = getCapability();
  
  const labels = [];
  const current = [];
  const target = [];
  
  capabilities.forEach(cap => {
    labels.push(cap.dimension);
    current.push(cap.current);
    target.push(cap.target);
  });
  
  // 如果沒有 Capability 資料，使用預設值
  if (labels.length === 0) {
    return getDefaultChartData();
  }
  
  return {
    radar: {
      labels: labels,
      current: current,
      target: target
    },
    burndown: getDefaultChartData().burndown,
    funnel: getDefaultChartData().funnel,
    adoption: getDefaultChartData().adoption
  };
}

// ==================== 輔助函數 ====================

/**
 * 取得工作表
 */
function getSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    return spreadsheet.getSheetByName(sheetName);
  } catch (error) {
    console.error(`無法取得工作表 ${sheetName}:`, error);
    return null;
  }
}

/**
 * 格式化日期為 ISO 8601 格式
 */
function formatDate(date) {
  if (!date) return '';
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  if (typeof date === 'string') {
    return date;
  }
  
  return '';
}

/**
 * 記錄 API 請求到 Audit Log
 * 
 * 注意：在 Web App 模式下，Session.getActiveUser().getEmail() 
 * 可能因隱私限制無法取得外部請求者的 email，將記錄為 'anonymous'
 */
function logRequest(endpoint) {
  try {
    const sheet = getSheet(SHEET_NAMES.AUDIT_LOG);
    if (!sheet) return;
    
    const timestamp = new Date();
    // 在 Web App 中，getActiveUser() 可能無法取得外部用戶資訊
    let user = 'anonymous';
    try {
      const email = Session.getActiveUser().getEmail();
      if (email) user = email;
    } catch (e) {
      // 隱私限制，使用預設值
    }
    
    sheet.appendRow([
      timestamp,
      user,
      endpoint,
      'API_REQUEST'
    ]);
  } catch (error) {
    // 記錄失敗不應影響主要功能
    console.error('logRequest 錯誤:', error);
  }
}

// ==================== 預設值函數 ====================

/**
 * 預設 KPI 資料
 */
function getDefaultKPI() {
  return {
    healthScore: 76,
    healthTrend: 'up',
    roi: 145,
    progress: 73,
    engagement: 68,
    highRisks: 0
  };
}

/**
 * 預設資源資料
 */
function getDefaultResources() {
  return {
    totalBudget: '$2.5M',
    usedBudget: '$1.8M (72%)',
    totalHeadcount: 45,
    allocatedHeadcount: '38 (84%)'
  };
}

/**
 * 預設圖表資料
 */
function getDefaultChartData() {
  return {
    radar: {
      labels: ['策略規劃', '流程優化', '技術能力', '人才發展', '數據治理', '創新文化'],
      current: [75, 82, 68, 71, 79, 85],
      target: [85, 90, 85, 85, 90, 90]
    },
    burndown: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      ideal: [100, 83, 66, 49, 32, 15],
      actual: [100, 85, 68, 52, 35, 18]
    },
    funnel: {
      labels: ['認知階段', '學習階段', '實作階段', '精通階段', '教學階段'],
      values: [450, 320, 180, 95, 42]
    },
    adoption: {
      labels: ['創新者', '早期採用者', '早期大眾', '晚期大眾', '落後者'],
      values: [2.5, 13.5, 34, 34, 16]
    }
  };
}

// ==================== 測試函數 ====================

/**
 * 測試函數 - 在 Apps Script 編輯器中執行此函數來測試
 */
function testAPI() {
  console.log('=== 測試 API ===');
  
  console.log('\n1. 測試 getKPI:');
  console.log(JSON.stringify(getKPI(), null, 2));
  
  console.log('\n2. 測試 getRisks:');
  console.log(JSON.stringify(getRisks(), null, 2));
  
  console.log('\n3. 測試 getProjects:');
  console.log(JSON.stringify(getProjects(), null, 2));
  
  console.log('\n4. 測試 getQuickWins:');
  console.log(JSON.stringify(getQuickWins(), null, 2));
  
  console.log('\n5. 測試 getFullData:');
  const fullData = getFullData();
  console.log(JSON.stringify(fullData, null, 2));
  
  console.log('\n=== 測試完成 ===');
  console.log('高風險數量:', fullData.kpi.highRisks);
}

/**
 * 測試單一工作表是否存在
 */
function testSheetExists() {
  console.log('=== 檢查工作表 ===');
  
  for (const [key, sheetName] of Object.entries(SHEET_NAMES)) {
    const sheet = getSheet(sheetName);
    console.log(`${sheetName}: ${sheet ? '✓ 存在' : '✗ 不存在'}`);
  }
  
  console.log('=== 檢查完成 ===');
}

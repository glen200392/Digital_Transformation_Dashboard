/**
 * ============================================================
 * 數位轉型儀表板 - Google Apps Script 後端擴充
 * 版本: 2.3.0
 * 
 * 新增功能：
 * - doPost 處理資料輸入請求
 * - 單筆資料新增 (addProject, addRisk, addQuickWin, updateKPI)
 * - 批次資料導入 (bulkImport)
 * - 資料驗證
 * - 錯誤處理
 * 
 * 部署說明：
 * 1. 複製此腳本到您的 Google Apps Script 專案
 * 2. 修改下方的 SHEET_ID 為您的 Google Sheet ID
 * 3. 部署為 Web App
 * ============================================================
 */

// ==================== 設定區 ====================

// Google Sheet ID - ⚠️ 請替換為您的 Sheet ID
const SHEET_ID = '1yyjwY2tDcV1_6mF8KjdkkEPz4jYGWWnIZIiWrbpNpfk';

// 工作表名稱設定
const SHEET_NAMES = {
  PROJECTS: 'Projects',
  RISKS: 'Risk_Register',
  QUICK_WINS: 'QuickWins',
  KPI: 'KPI_Metrics',
  AUDIT_LOG: '_AuditLog'
};

// 欄位索引對照（方便維護）
const COLUMN_INDEX = {
  KPI: {
    TIMESTAMP: 0,
    METRIC: 1,    // metric 名稱在第2欄（索引 1）
    VALUE: 2,
    TARGET: 3,
    UNIT: 4,
    CATEGORY: 5
  }
};

/**
 * doPost - 處理 HTTP POST 請求
 * 接收前端提交的資料並寫入 Google Sheets
 */
function doPost(e) {
  try {
    // CORS 設定
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // 解析請求內容
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createErrorResponse('無效的 JSON 格式', 400);
    }
    
    const action = requestData.action || e.parameter.action;
    
    // 記錄請求到審計日誌
    logAuditEntry(action, requestData);
    
    let result;
    
    // 根據 action 執行對應操作
    switch (action) {
      case 'addProject':
        result = addProject(requestData);
        break;
      case 'addRisk':
        result = addRisk(requestData);
        break;
      case 'addQuickWin':
        result = addQuickWin(requestData);
        break;
      case 'updateKPI':
        result = updateKPI(requestData);
        break;
      case 'bulkImport':
        result = bulkImport(requestData);
        break;
      default:
        return createErrorResponse('未知的操作: ' + action, 400);
    }
    
    return createSuccessResponse(result);
    
  } catch (error) {
    console.error('POST 請求處理錯誤:', error);
    return createErrorResponse(error.message, 500);
  }
}

/**
 * 新增專案
 */
function addProject(data) {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  
  // 驗證必填欄位
  const validation = validateProject(data);
  if (!validation.valid) {
    throw new Error('資料驗證失敗: ' + validation.errors.join(', '));
  }
  
  // 準備資料列
  const row = [
    new Date().toISOString(),           // timestamp
    data.name || '',
    data.department || '',
    data.status || 'planning',
    parseFloat(data.progress) || 0,
    parseFloat(data.budget) || 0,
    data.startDate || '',
    data.endDate || '',
    data.owner || '',
    data.description || ''
  ];
  
  // 附加到工作表
  sheet.appendRow(row);
  
  return {
    success: true,
    message: '專案已成功新增',
    data: { name: data.name }
  };
}

/**
 * 新增風險
 */
function addRisk(data) {
  const sheet = getSheet(SHEET_NAMES.RISKS);
  
  // 驗證必填欄位
  const validation = validateRisk(data);
  if (!validation.valid) {
    throw new Error('資料驗證失敗: ' + validation.errors.join(', '));
  }
  
  // 標準化風險等級
  const probability = normalizeLevelValue(data.probability);
  const impact = normalizeLevelValue(data.impact);
  
  // 準備資料列
  const row = [
    new Date().toISOString(),           // timestamp
    data.title || '',
    data.category || '',
    probability,
    impact,
    data.status || 'open',
    data.owner || '',
    data.mitigation || '',
    data.description || ''
  ];
  
  sheet.appendRow(row);
  
  return {
    success: true,
    message: '風險已成功新增',
    data: { title: data.title }
  };
}

/**
 * 新增 Quick Win
 */
function addQuickWin(data) {
  const sheet = getSheet(SHEET_NAMES.QUICK_WINS);
  
  // 驗證必填欄位
  const validation = validateQuickWin(data);
  if (!validation.valid) {
    throw new Error('資料驗證失敗: ' + validation.errors.join(', '));
  }
  
  // 準備資料列
  const row = [
    new Date().toISOString(),           // timestamp
    data.title || '',
    data.owner || '',
    data.status || 'pending',
    parseFloat(data.estimatedHours) || 0,
    data.dueDate || '',
    data.description || ''
  ];
  
  sheet.appendRow(row);
  
  return {
    success: true,
    message: 'Quick Win 已成功新增',
    data: { title: data.title }
  };
}

/**
 * 更新 KPI
 */
function updateKPI(data) {
  const sheet = getSheet(SHEET_NAMES.KPI);
  
  // 驗證必填欄位
  const validation = validateKPI(data);
  if (!validation.valid) {
    throw new Error('資料驗證失敗: ' + validation.errors.join(', '));
  }
  
  // 檢查是否已存在相同指標
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][COLUMN_INDEX.KPI.METRIC] === data.metric) {
      rowIndex = i + 1;
      break;
    }
  }
  
  // 準備資料列
  const row = [
    new Date().toISOString(),           // timestamp
    data.metric || '',
    parseFloat(data.value) || 0,
    parseFloat(data.target) || 0,
    data.unit || '',
    data.category || 'overall'
  ];
  
  if (rowIndex > 0) {
    // 更新現有資料
    for (let i = 0; i < row.length; i++) {
      sheet.getRange(rowIndex, i + 1).setValue(row[i]);
    }
    return {
      success: true,
      message: 'KPI 已成功更新',
      data: { metric: data.metric }
    };
  } else {
    // 新增資料
    sheet.appendRow(row);
    return {
      success: true,
      message: 'KPI 已成功新增',
      data: { metric: data.metric }
    };
  }
}

/**
 * 批次導入資料
 */
function bulkImport(requestData) {
  const { type, mode, data } = requestData;
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('沒有資料可導入');
  }
  
  let successCount = 0;
  let failCount = 0;
  const errors = [];
  
  // 根據類型呼叫對應的新增函數
  data.forEach((item, index) => {
    try {
      switch (type) {
        case 'projects':
          addProject(item);
          break;
        case 'risks':
          addRisk(item);
          break;
        case 'quickwins':
          addQuickWin(item);
          break;
        case 'kpi':
          updateKPI(item);
          break;
        default:
          throw new Error('未知的資料類型: ' + type);
      }
      successCount++;
    } catch (error) {
      failCount++;
      errors.push({
        index: index + 1,
        error: error.message
      });
    }
  });
  
  return {
    success: failCount === 0,
    message: `批次導入完成：成功 ${successCount} 筆，失敗 ${failCount} 筆`,
    data: {
      total: data.length,
      success: successCount,
      failed: failCount,
      errors: errors
    }
  };
}

// ==================== 驗證函數 ====================

function validateProject(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('專案名稱為必填');
  }
  if (!data.department || data.department.trim() === '') {
    errors.push('部門為必填');
  }
  if (!data.status) {
    errors.push('狀態為必填');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function validateRisk(data) {
  const errors = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('風險標題為必填');
  }
  if (!data.category) {
    errors.push('風險類別為必填');
  }
  if (!data.probability) {
    errors.push('發生機率為必填');
  }
  if (!data.impact) {
    errors.push('影響程度為必填');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function validateQuickWin(data) {
  const errors = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Quick Win 標題為必填');
  }
  if (!data.owner) {
    errors.push('負責人為必填');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function validateKPI(data) {
  const errors = [];
  
  if (!data.metric || data.metric.trim() === '') {
    errors.push('指標名稱為必填');
  }
  if (data.value === undefined || data.value === null) {
    errors.push('指標值為必填');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ==================== 工具函數 ====================

/**
 * 取得工作表
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  // 如果工作表不存在，建立它
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  return sheet;
}

/**
 * 初始化工作表（建立標題列）
 */
function initializeSheet(sheet, sheetName) {
  let headers = [];
  
  switch (sheetName) {
    case SHEET_NAMES.PROJECTS:
      headers = ['timestamp', 'name', 'department', 'status', 'progress', 'budget', 'startDate', 'endDate', 'owner', 'description'];
      break;
    case SHEET_NAMES.RISKS:
      headers = ['timestamp', 'title', 'category', 'probability', 'impact', 'status', 'owner', 'mitigation', 'description'];
      break;
    case SHEET_NAMES.QUICK_WINS:
      headers = ['timestamp', 'title', 'owner', 'status', 'estimatedHours', 'dueDate', 'description'];
      break;
    case SHEET_NAMES.KPI:
      headers = ['timestamp', 'metric', 'value', 'target', 'unit', 'category'];
      break;
  }
  
  if (headers.length > 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

/**
 * 標準化風險等級值
 */
function normalizeLevelValue(value) {
  const levelMap = {
    'low': 2,
    'medium': 3,
    'high': 4
  };
  
  const strValue = String(value).toLowerCase();
  return levelMap[strValue] || value;
}

/**
 * 記錄審計日誌
 */
function logAuditEntry(action, data) {
  try {
    const sheet = getSheet(SHEET_NAMES.AUDIT_LOG);
    const row = [
      new Date().toISOString(),
      action,
      JSON.stringify(data).substring(0, 1000),  // 限制長度
      Session.getActiveUser().getEmail() || 'anonymous'
    ];
    sheet.appendRow(row);
  } catch (error) {
    console.error('審計日誌記錄失敗:', error);
  }
}

/**
 * 建立成功回應
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 建立錯誤回應
 */
function createErrorResponse(message, code) {
  const response = {
    success: false,
    error: message,
    code: code
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== 測試函數 ====================

/**
 * 測試 POST 請求處理
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        action: 'addProject',
        name: '測試專案',
        department: '測試部門',
        status: 'planning',
        progress: 0,
        budget: 100000,
        owner: '測試人員'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

/**
 * 測試批次導入
 */
function testBulkImport() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        action: 'bulkImport',
        type: 'projects',
        mode: 'append',
        data: [
          {
            name: '測試專案1',
            department: '部門A',
            status: 'planning',
            budget: 50000
          },
          {
            name: '測試專案2',
            department: '部門B',
            status: 'in_progress',
            budget: 80000
          }
        ]
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

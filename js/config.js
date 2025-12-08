/**
 * ============================================================
 * 數位轉型儀表板 - 全域設定檔
 * 版本: 2.0.0
 * 
 * 所有可配置項目集中管理，方便未來調整
 * ============================================================
 */

const CONFIG = {
    // ==================== API 設定 ====================
    api: {
        baseUrl: "https://script.google.com/macros/s/AKfycbzmfTpIGJrm40TxOMpkEUfCLdgU2KUqJHvG-ZES_9nTvwnv1WBYoacvYmDBU2smh-p0Og/exec",
        timeout: 30000,           // 30 秒超時
        retryAttempts: 3,         // 重試次數
        retryDelay: 1000,         // 重試延遲（毫秒）
        cacheExpiry: 60000,       // 快取有效期（1 分鐘）
        fallbackDataPath: 'data/fallback.json'  // 離線備用資料路徑
    },
    
    // ==================== 自動刷新設定 ====================
    refresh: {
        enabled: true,
        interval: 5 * 60 * 1000,  // 5 分鐘
        showNotification: true,
        notificationDuration: 3000
    },
    
    // ==================== UI 設定 ====================
    ui: {
        theme: 'light',           // 'light' | 'dark' | 'auto'
        language: 'zh-TW',        // 'zh-TW' | 'en'
        animationEnabled: true,
        animationDuration: 300,
        defaultLayer: 1,
        defaultDetailTab: 'projects',
        // 時間顯示設定
        timeDisplay: {
            showDate: true,           // 顯示日期
            showRelative: false,      // 使用相對時間
            showSheetUpdateTime: true // 顯示 Google Sheets 更新時間
        }
    },
    
    // ==================== 圖表設定 ====================
    charts: {
        colors: {
            primary: 'rgba(102, 126, 234, 1)',
            primaryLight: 'rgba(102, 126, 234, 0.2)',
            secondary: 'rgba(118, 75, 162, 1)',
            secondaryLight: 'rgba(118, 75, 162, 0.2)',
            success: 'rgba(74, 222, 128, 1)',
            warning: 'rgba(250, 204, 21, 1)',
            danger: 'rgba(248, 113, 113, 1)',
            gray: 'rgba(203, 213, 225, 1)',
            grayLight: 'rgba(203, 213, 225, 0.2)'
        },
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        responsive: true,
        maintainAspectRatio: false
    },
    
    // ==================== KPI 閾值設定 ====================
    thresholds: {
        healthScore: { 
            green: 80, 
            yellow: 60,
            description: '轉型健康度總分'
        },
        roi: { 
            green: 150, 
            yellow: 100,
            description: '投資報酬率 %'
        },
        progress: { 
            green: 80, 
            yellow: 60,
            description: '整體進度 %'
        },
        engagement: { 
            green: 70, 
            yellow: 50,
            description: '員工參與度 %'
        },
        highRiskMax: {
            value: 0,
            description: '高風險項目數量上限'
        }
    },
    
    // ==================== 狀態顏色對應 ====================
    statusColors: {
        green: {
            background: '#dcfce7',
            text: '#16a34a',
            border: '#4ade80',
            emoji: '🟢',
            label: '優秀'
        },
        yellow: {
            background: '#fef3c7',
            text: '#ca8a04',
            border: '#facc15',
            emoji: '🟡',
            label: '正常'
        },
        red: {
            background: '#fee2e2',
            text: '#dc2626',
            border: '#f87171',
            emoji: '🔴',
            label: '需改善'
        }
    },
    
    // ==================== 功能開關 (Feature Flags) ====================
    features: {
        enableExport: true,           // 匯出功能
        enableManualRefresh: true,    // 手動刷新按鈕
        enableAutoRefresh: true,      // 自動刷新
        enableOfflineMode: true,      // 離線模式
        enableNotifications: true,    // 通知功能
        enableDarkMode: false,        // 深色模式（開發中）
        enableComments: false,        // 評論功能（未來）
        enableAlerts: false,          // 警報功能（未來）
        enableCollaboration: false,   // 協作功能（未來）
        debugMode: false              // 除錯模式
    },
    
    // ==================== 本地儲存鍵值 ====================
    storage: {
        prefix: 'dtd_',              // 儲存前綴
        keys: {
            preferences: 'preferences',
            cache: 'data_cache',
            lastSync: 'last_sync',
            theme: 'theme'
        }
    },
    
    // ==================== 安全性設定 ====================
    security: {
        enableXSSProtection: true,         // XSS 防護
        enableRateLimiting: true,          // 速率限制
        maxRequestsPerMinute: 60,          // 每分鐘最大請求數
        enableAuditLog: true,              // 審計日誌
        auditLogRetentionDays: 30          // 日誌保留天數
    },
    
    // ==================== 資料保護設定 ====================
    dataProtection: {
        enableAutoBackup: true,            // 自動備份
        maxBackupVersions: 5,              // 最大備份版本數
        confirmBeforeDelete: true,         // 刪除前確認
        enableDataValidation: true         // 資料驗證
    },
    
    // ==================== 資料導入設定 ====================
    dataImport: {
        allowedFileTypes: ['.xlsx', '.xls', '.csv'],
        maxFileSize: 5 * 1024 * 1024,  // 5MB
        maxRowsPerImport: 1000,
        importMode: 'append',           // 'append' | 'replace'
        validateOnUpload: true,
        showPreview: true,
        supportedDataTypes: ['kpi', 'projects', 'quickwins', 'risks']
    },
    
    // ==================== AI 服務設定（預留接口）====================
    ai: {
        // 語音辨識 (ASR)
        speech: {
            enabled: false,
            provider: 'whisper',        // 'whisper' | 'azure' | 'google'
            endpoint: '',               // 本地或雲端 API 端點
            apiKey: '',                 // 從環境變數或安全儲存讀取
            language: 'zh-TW',
            model: 'large-v3'
        },
        // LLM 文字理解
        llm: {
            enabled: false,
            provider: 'local',          // 'local' | 'openai' | 'claude' | 'gemini'
            endpoint: '',               // 本地 LLM 端點 (如 Ollama)
            apiKey: '',
            model: '',
            systemPrompt: '你是數位轉型專案助理，協助分析和整理專案資料。請將非結構化資料轉換為結構化格式。'
        },
        // OCR/視覺辨識
        vision: {
            enabled: false,
            provider: 'paddleocr',      // 'paddleocr' | 'llava' | 'qwen-vl'
            endpoint: '',
            apiKey: '',
            supportedFormats: ['jpg', 'png', 'pdf']
        }
    },
    
    // ==================== 版本資訊 ====================
    version: {
        app: '2.2.0',
        api: 'v2',
        buildDate: '2025-12-06',
        changelog: 'https://github.com/glen200392/Digital_Transformation_Dashboard/releases'
    }
};

// 凍結設定物件，防止意外修改
Object.freeze(CONFIG);
Object.freeze(CONFIG.api);
Object.freeze(CONFIG.refresh);
Object.freeze(CONFIG.ui);
Object.freeze(CONFIG.ui.timeDisplay);
Object.freeze(CONFIG.charts);
Object.freeze(CONFIG.charts.colors);
Object.freeze(CONFIG.thresholds);
Object.freeze(CONFIG.statusColors);
Object.freeze(CONFIG.features);
Object.freeze(CONFIG.storage);
Object.freeze(CONFIG.security);
Object.freeze(CONFIG.dataProtection);
Object.freeze(CONFIG.dataImport);
Object.freeze(CONFIG.ai);
Object.freeze(CONFIG.ai.speech);
Object.freeze(CONFIG.ai.llm);
Object.freeze(CONFIG.ai.vision);
Object.freeze(CONFIG.version);

// 匯出給其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

console.log(`[Config] 設定檔已載入 v${CONFIG.version.app}`);
/**
 * ============================================================
 * 數位轉型儀表板 - 審計日誌模組
 * 版本: 2.1.0
 * 
 * 記錄所有操作以供審計和追蹤
 * ============================================================
 */

class AuditLogger {
    constructor(config = CONFIG?.security) {
        this.config = config || {
            enableAuditLog: true,
            auditLogRetentionDays: 30
        };
        
        this.RETENTION_DAYS = this.config.auditLogRetentionDays || 30;
        this.storageKey = 'dtd_audit_logs';
        
        // 操作類型常數
        this.ActionTypes = {
            DATA_LOAD: 'DATA_LOAD',
            DATA_REFRESH: 'DATA_REFRESH',
            LAYER_SWITCH: 'LAYER_SWITCH',
            TAB_SWITCH: 'TAB_SWITCH',
            BACKUP_CREATE: 'BACKUP_CREATE',
            BACKUP_RESTORE: 'BACKUP_RESTORE',
            BACKUP_DELETE: 'BACKUP_DELETE',
            ERROR: 'ERROR',
            SECURITY_VIOLATION: 'SECURITY_VIOLATION',
            RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
        };
        
        // 初始化時清除過期日誌
        this.clearExpiredLogs();
        
        console.log('[AuditLogger] AuditLogger 模組已初始化');
    }
    
    /**
     * 記錄操作
     */
    log(action, details = {}) {
        if (!this.config.enableAuditLog) {
            return;
        }
        
        try {
            const logEntry = {
                id: this.generateLogId(),
                action: action,
                timestamp: new Date().toISOString(),
                timestampMs: Date.now(),
                details: this.sanitizeDetails(details),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            // 取得現有日誌
            const logs = this.getLogs();
            
            // 添加新日誌
            logs.push(logEntry);
            
            // 儲存回 localStorage
            this.saveLogs(logs);
            
            // 在除錯模式下輸出到 console
            if (CONFIG?.features?.debugMode) {
                console.log('[AuditLogger] 日誌記錄:', logEntry);
            }
            
        } catch (error) {
            console.error('[AuditLogger] 記錄日誌失敗:', error);
        }
    }
    
    /**
     * 清理敏感資訊
     */
    sanitizeDetails(details) {
        // 建立副本以避免修改原始物件
        const sanitized = { ...details };
        
        // 移除或遮罩敏感欄位
        const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'credential'];
        
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });
        
        // 如果包含錯誤物件，只保留訊息和堆疊
        if (sanitized.error instanceof Error) {
            sanitized.error = {
                message: sanitized.error.message,
                stack: sanitized.error.stack
            };
        }
        
        return sanitized;
    }
    
    /**
     * 生成日誌 ID
     */
    generateLogId() {
        return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 取得所有日誌
     */
    getLogs() {
        try {
            const logsStr = localStorage.getItem(this.storageKey);
            return logsStr ? JSON.parse(logsStr) : [];
        } catch (error) {
            console.error('[AuditLogger] 讀取日誌失敗:', error);
            return [];
        }
    }
    
    /**
     * 儲存日誌
     */
    saveLogs(logs) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(logs));
        } catch (error) {
            console.error('[AuditLogger] 儲存日誌失敗:', error);
            
            // 如果儲存空間不足，清除最舊的 20% 日誌
            if (error.name === 'QuotaExceededError') {
                const removeCount = Math.ceil(logs.length * 0.2);
                const trimmedLogs = logs.slice(removeCount);
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
                    console.warn(`[AuditLogger] 儲存空間不足，已清除 ${removeCount} 筆舊日誌`);
                } catch (retryError) {
                    console.error('[AuditLogger] 重試儲存仍失敗:', retryError);
                }
            }
        }
    }
    
    /**
     * 取得指定日期範圍的日誌
     */
    getLogsByDateRange(startDate, endDate) {
        const logs = this.getLogs();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        return logs.filter(log => {
            const logTime = log.timestampMs || new Date(log.timestamp).getTime();
            return logTime >= start && logTime <= end;
        });
    }
    
    /**
     * 取得指定動作類型的日誌
     */
    getLogsByAction(action) {
        const logs = this.getLogs();
        return logs.filter(log => log.action === action);
    }
    
    /**
     * 匯出日誌
     */
    exportLogs(format = 'json', startDate = null, endDate = null) {
        let logs = this.getLogs();
        
        // 如果指定日期範圍，進行篩選
        if (startDate && endDate) {
            logs = this.getLogsByDateRange(startDate, endDate);
        }
        
        if (format === 'json') {
            return this.exportAsJSON(logs);
        } else if (format === 'csv') {
            return this.exportAsCSV(logs);
        } else {
            throw new Error(`不支援的匯出格式: ${format}`);
        }
    }
    
    /**
     * 匯出為 JSON 格式
     */
    exportAsJSON(logs) {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalLogs: logs.length,
            logs: logs
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    /**
     * 匯出為 CSV 格式
     */
    exportAsCSV(logs) {
        if (logs.length === 0) {
            return 'No logs to export';
        }
        
        // CSV 標題
        const headers = ['ID', 'Action', 'Timestamp', 'Details', 'User Agent'];
        let csv = headers.join(',') + '\n';
        
        // 資料行
        logs.forEach(log => {
            const row = [
                log.id,
                log.action,
                log.timestamp,
                JSON.stringify(log.details).replace(/"/g, '""'), // 處理 CSV 中的引號
                `"${log.userAgent}"`
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }
    
    /**
     * 清除過期日誌
     */
    clearExpiredLogs() {
        try {
            const logs = this.getLogs();
            const now = Date.now();
            const retentionMs = this.RETENTION_DAYS * 24 * 60 * 60 * 1000;
            
            const validLogs = logs.filter(log => {
                const logTime = log.timestampMs || new Date(log.timestamp).getTime();
                return now - logTime < retentionMs;
            });
            
            if (validLogs.length < logs.length) {
                this.saveLogs(validLogs);
                console.log(`[AuditLogger] 已清除 ${logs.length - validLogs.length} 筆過期日誌`);
            }
            
        } catch (error) {
            console.error('[AuditLogger] 清除過期日誌失敗:', error);
        }
    }
    
    /**
     * 清除所有日誌
     */
    clearAllLogs(confirm = true) {
        if (confirm && !window.confirm('確定要清除所有審計日誌嗎？此操作無法復原。')) {
            return false;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            console.log('[AuditLogger] 已清除所有日誌');
            return true;
        } catch (error) {
            console.error('[AuditLogger] 清除日誌失敗:', error);
            return false;
        }
    }
    
    /**
     * 取得日誌統計資訊
     */
    getLogStatistics() {
        const logs = this.getLogs();
        
        // 按動作類型統計
        const actionCounts = {};
        logs.forEach(log => {
            actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        });
        
        // 計算日期範圍
        const timestamps = logs.map(log => log.timestampMs || new Date(log.timestamp).getTime());
        const oldestLog = timestamps.length > 0 ? Math.min(...timestamps) : null;
        const newestLog = timestamps.length > 0 ? Math.max(...timestamps) : null;
        
        return {
            totalLogs: logs.length,
            actionCounts: actionCounts,
            oldestLog: oldestLog ? new Date(oldestLog).toISOString() : null,
            newestLog: newestLog ? new Date(newestLog).toISOString() : null,
            retentionDays: this.RETENTION_DAYS
        };
    }
    
    /**
     * 搜尋日誌
     */
    searchLogs(query) {
        const logs = this.getLogs();
        const lowerQuery = query.toLowerCase();
        
        return logs.filter(log => {
            // 搜尋 action
            if (log.action.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            // 搜尋 details
            const detailsStr = JSON.stringify(log.details).toLowerCase();
            if (detailsStr.includes(lowerQuery)) {
                return true;
            }
            
            return false;
        });
    }
    
    /**
     * 下載日誌檔案
     */
    downloadLogs(format = 'json', filename = null) {
        try {
            const content = this.exportLogs(format);
            const defaultFilename = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
            const blob = new Blob([content], { 
                type: format === 'json' ? 'application/json' : 'text/csv' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || defaultFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`[AuditLogger] 日誌已下載: ${a.download}`);
            return true;
            
        } catch (error) {
            console.error('[AuditLogger] 下載日誌失敗:', error);
            return false;
        }
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuditLogger;
}

console.log('[AuditLogger] AuditLogger 模組已載入');

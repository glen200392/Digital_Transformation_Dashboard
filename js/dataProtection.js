/**
 * ============================================================
 * 數位轉型儀表板 - 資料保護模組
 * 版本: 2.1.0
 * 
 * 提供資料備份、還原、驗證功能
 * ============================================================
 */

class DataProtection {
    constructor(config = CONFIG?.dataProtection) {
        this.config = config || {
            enableAutoBackup: true,
            maxBackupVersions: 5,
            confirmBeforeDelete: true,
            enableDataValidation: true
        };
        
        this.MAX_BACKUPS = this.config.maxBackupVersions || 5;
        this.storagePrefix = 'dtd_backup_';
        
        console.log('[DataProtection] DataProtection 模組已初始化');
    }
    
    /**
     * 建立資料備份到 localStorage
     */
    createBackup(data, description = '') {
        try {
            if (!data) {
                console.warn('[DataProtection] 無法備份空資料');
                return false;
            }
            
            const timestamp = Date.now();
            const backupKey = `${this.storagePrefix}${timestamp}`;
            
            const backup = {
                version: timestamp,
                timestamp: new Date(timestamp).toISOString(),
                description: description || `自動備份 ${new Date(timestamp).toLocaleString('zh-TW')}`,
                data: data,
                checksum: this.calculateChecksum(data)
            };
            
            // 儲存備份
            localStorage.setItem(backupKey, JSON.stringify(backup));
            
            // 清除舊備份
            this.clearOldBackups();
            
            console.log(`[DataProtection] 備份已建立: ${backupKey}`);
            return timestamp;
            
        } catch (error) {
            console.error('[DataProtection] 建立備份失敗:', error);
            
            // 如果是 QuotaExceededError，清除最舊的備份後重試
            if (error.name === 'QuotaExceededError') {
                console.warn('[DataProtection] 儲存空間不足，清除舊備份...');
                this.clearOldBackups(1);
                
                try {
                    const timestamp = Date.now();
                    const backupKey = `${this.storagePrefix}${timestamp}`;
                    const backup = {
                        version: timestamp,
                        timestamp: new Date(timestamp).toISOString(),
                        description: description,
                        data: data,
                        checksum: this.calculateChecksum(data)
                    };
                    localStorage.setItem(backupKey, JSON.stringify(backup));
                    console.log(`[DataProtection] 備份已建立（清除後）: ${backupKey}`);
                    return timestamp;
                } catch (retryError) {
                    console.error('[DataProtection] 重試備份仍失敗:', retryError);
                    return false;
                }
            }
            
            return false;
        }
    }
    
    /**
     * 還原指定版本的備份
     */
    restoreBackup(version) {
        try {
            const backupKey = `${this.storagePrefix}${version}`;
            const backupStr = localStorage.getItem(backupKey);
            
            if (!backupStr) {
                console.warn(`[DataProtection] 找不到備份版本: ${version}`);
                return null;
            }
            
            const backup = JSON.parse(backupStr);
            
            // 驗證資料完整性
            if (this.config.enableDataValidation) {
                const isValid = this.verifyChecksum(backup.data, backup.checksum);
                if (!isValid) {
                    console.error('[DataProtection] 備份資料校驗失敗');
                    return null;
                }
            }
            
            console.log(`[DataProtection] 已還原備份: ${backupKey}`);
            return backup.data;
            
        } catch (error) {
            console.error('[DataProtection] 還原備份失敗:', error);
            return null;
        }
    }
    
    /**
     * 取得所有備份版本列表
     */
    getBackupList() {
        const backups = [];
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                if (key && key.startsWith(this.storagePrefix)) {
                    const backupStr = localStorage.getItem(key);
                    if (backupStr) {
                        const backup = JSON.parse(backupStr);
                        backups.push({
                            version: backup.version,
                            timestamp: backup.timestamp,
                            description: backup.description,
                            size: new Blob([backupStr]).size
                        });
                    }
                }
            }
            
            // 按時間排序（最新的在前）
            backups.sort((a, b) => b.version - a.version);
            
            console.log(`[DataProtection] 找到 ${backups.length} 個備份`);
            return backups;
            
        } catch (error) {
            console.error('[DataProtection] 取得備份列表失敗:', error);
            return [];
        }
    }
    
    /**
     * 清除超過限制的舊備份
     */
    clearOldBackups(keepCount = null) {
        try {
            const maxBackups = keepCount !== null ? keepCount : this.MAX_BACKUPS;
            const backups = this.getBackupList();
            
            // 如果備份數量未超過限制，不執行清理
            if (backups.length <= maxBackups) {
                return;
            }
            
            // 刪除最舊的備份
            const toDelete = backups.slice(maxBackups);
            let deletedCount = 0;
            
            toDelete.forEach(backup => {
                const backupKey = `${this.storagePrefix}${backup.version}`;
                localStorage.removeItem(backupKey);
                deletedCount++;
            });
            
            console.log(`[DataProtection] 已清除 ${deletedCount} 個舊備份`);
            
        } catch (error) {
            console.error('[DataProtection] 清除舊備份失敗:', error);
        }
    }
    
    /**
     * 驗證資料格式
     */
    validateData(data, schema = null) {
        if (!data || typeof data !== 'object') {
            console.warn('[DataProtection] 資料格式無效：必須是物件');
            return false;
        }
        
        // 使用預設 schema 如果沒有提供
        const validationSchema = schema || this.getDefaultSchema();
        
        try {
            // 驗證必要欄位
            for (const field of validationSchema.required || []) {
                if (!(field in data)) {
                    console.warn(`[DataProtection] 缺少必要欄位: ${field}`);
                    return false;
                }
            }
            
            // 驗證欄位類型
            for (const [field, type] of Object.entries(validationSchema.types || {})) {
                if (field in data) {
                    const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field];
                    if (actualType !== type && data[field] !== null) {
                        console.warn(`[DataProtection] 欄位類型錯誤: ${field} (預期: ${type}, 實際: ${actualType})`);
                        return false;
                    }
                }
            }
            
            console.log('[DataProtection] 資料驗證通過');
            return true;
            
        } catch (error) {
            console.error('[DataProtection] 資料驗證失敗:', error);
            return false;
        }
    }
    
    /**
     * 取得預設的資料驗證 schema
     */
    getDefaultSchema() {
        return {
            required: ['kpi'],
            types: {
                kpi: 'object',
                quickWins: 'array',
                projects: 'array',
                risks: 'array',
                resources: 'object',
                metrics: 'object',
                charts: 'object'
            }
        };
    }
    
    /**
     * 敏感操作確認對話框
     */
    confirmAction(message) {
        if (!this.config.confirmBeforeDelete) {
            return true;
        }
        
        return confirm(message || '確定要執行此操作嗎？');
    }
    
    /**
     * 計算資料 Checksum
     */
    calculateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return hash.toString(16);
    }
    
    /**
     * 驗證 Checksum
     */
    verifyChecksum(data, expectedChecksum) {
        const actualChecksum = this.calculateChecksum(data);
        const isValid = actualChecksum === expectedChecksum;
        
        if (!isValid) {
            console.warn('[DataProtection] Checksum 驗證失敗');
        }
        
        return isValid;
    }
    
    /**
     * 匯出所有備份（用於遷移或備份）
     */
    exportAllBackups() {
        const backups = this.getBackupList();
        const exportData = [];
        
        backups.forEach(backupInfo => {
            const backupKey = `${this.storagePrefix}${backupInfo.version}`;
            const backupStr = localStorage.getItem(backupKey);
            if (backupStr) {
                exportData.push(JSON.parse(backupStr));
            }
        });
        
        return exportData;
    }
    
    /**
     * 刪除特定備份
     */
    deleteBackup(version) {
        try {
            if (this.config.confirmBeforeDelete) {
                if (!confirm('確定要刪除此備份嗎？')) {
                    return false;
                }
            }
            
            const backupKey = `${this.storagePrefix}${version}`;
            localStorage.removeItem(backupKey);
            console.log(`[DataProtection] 已刪除備份: ${backupKey}`);
            return true;
            
        } catch (error) {
            console.error('[DataProtection] 刪除備份失敗:', error);
            return false;
        }
    }
    
    /**
     * 取得儲存使用情況
     */
    getStorageUsage() {
        let totalSize = 0;
        const backups = this.getBackupList();
        
        backups.forEach(backup => {
            totalSize += backup.size;
        });
        
        return {
            backupCount: backups.length,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            maxBackups: this.MAX_BACKUPS
        };
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataProtection;
}

console.log('[DataProtection] DataProtection 模組已載入');

/**
 * ============================================================
 * 數位轉型儀表板 - 輸入資料驗證模組
 * 版本: 1.0.0
 * 
 * 負責驗證所有輸入資料的格式與內容
 * ============================================================
 */

class InputValidator {
    constructor() {
        console.log('[InputValidator] 輸入驗證模組已初始化');
    }
    
    /**
     * 驗證專案資料
     */
    validateProject(data) {
        const errors = [];
        const warnings = [];
        
        // 必填欄位
        if (!data.name || data.name.trim() === '') {
            errors.push('專案名稱為必填欄位');
        }
        if (!data.department || data.department.trim() === '') {
            errors.push('部門為必填欄位');
        }
        if (!data.status) {
            errors.push('狀態為必填欄位');
        }
        
        // 進度範圍檢查 (0-100)
        if (data.progress !== undefined && data.progress !== null) {
            const progress = parseFloat(data.progress);
            if (isNaN(progress) || progress < 0 || progress > 100) {
                errors.push('進度必須在 0-100 之間');
            }
        }
        
        // 預算格式檢查
        if (data.budget !== undefined && data.budget !== null) {
            const budget = parseFloat(data.budget);
            if (isNaN(budget) || budget < 0) {
                errors.push('預算必須為正數');
            }
        }
        
        // 日期格式檢查
        if (data.startDate && !this.isValidDate(data.startDate)) {
            errors.push('開始日期格式不正確');
        }
        if (data.endDate && !this.isValidDate(data.endDate)) {
            errors.push('結束日期格式不正確');
        }
        
        // 日期邏輯檢查
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            if (start > end) {
                errors.push('開始日期不能晚於結束日期');
            }
        }
        
        // 狀態有效性檢查
        const validStatuses = ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'];
        if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
            warnings.push(`狀態值 "${data.status}" 不在標準列表中`);
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 驗證風險資料
     */
    validateRisk(data) {
        const errors = [];
        const warnings = [];
        
        // 必填欄位
        if (!data.title || data.title.trim() === '') {
            errors.push('風險標題為必填欄位');
        }
        if (!data.category) {
            errors.push('風險類別為必填欄位');
        }
        if (!data.probability) {
            errors.push('發生機率為必填欄位');
        }
        if (!data.impact) {
            errors.push('影響程度為必填欄位');
        }
        
        // 機率和影響值檢查 (1-5 或 low/medium/high)
        const validLevels = ['low', 'medium', 'high', '1', '2', '3', '4', '5'];
        if (data.probability && !validLevels.includes(String(data.probability).toLowerCase())) {
            errors.push('發生機率必須為 1-5 或 low/medium/high');
        }
        if (data.impact && !validLevels.includes(String(data.impact).toLowerCase())) {
            errors.push('影響程度必須為 1-5 或 low/medium/high');
        }
        
        // 狀態檢查
        const validStatuses = ['open', 'monitoring', 'mitigated', 'closed'];
        if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
            warnings.push(`狀態值 "${data.status}" 不在標準列表中`);
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 驗證 Quick Win 資料
     */
    validateQuickWin(data) {
        const errors = [];
        const warnings = [];
        
        // 必填欄位
        if (!data.title || data.title.trim() === '') {
            errors.push('Quick Win 標題為必填欄位');
        }
        if (!data.owner) {
            errors.push('負責人為必填欄位');
        }
        
        // 預計工時檢查
        if (data.estimatedHours !== undefined && data.estimatedHours !== null) {
            const hours = parseFloat(data.estimatedHours);
            if (isNaN(hours) || hours <= 0) {
                errors.push('預計工時必須為正數');
            }
        }
        
        // 狀態檢查
        const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
            warnings.push(`狀態值 "${data.status}" 不在標準列表中`);
        }
        
        // 日期檢查
        if (data.dueDate && !this.isValidDate(data.dueDate)) {
            errors.push('到期日期格式不正確');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 驗證 KPI 資料
     */
    validateKPI(data) {
        const errors = [];
        const warnings = [];
        
        // 必填欄位
        if (!data.metric || data.metric.trim() === '') {
            errors.push('指標名稱為必填欄位');
        }
        if (data.value === undefined || data.value === null) {
            errors.push('指標值為必填欄位');
        }
        
        // 數值檢查
        if (data.value !== undefined && data.value !== null) {
            const value = parseFloat(data.value);
            if (isNaN(value)) {
                errors.push('指標值必須為數字');
            }
        }
        
        // 目標值檢查
        if (data.target !== undefined && data.target !== null) {
            const target = parseFloat(data.target);
            if (isNaN(target)) {
                errors.push('目標值必須為數字');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 批次驗證資料
     */
    validateBatch(dataArray, type) {
        const results = [];
        
        dataArray.forEach((item, index) => {
            let validation;
            
            switch (type) {
                case 'project':
                case 'projects':
                    validation = this.validateProject(item);
                    break;
                case 'risk':
                case 'risks':
                    validation = this.validateRisk(item);
                    break;
                case 'quickwin':
                case 'quickwins':
                    validation = this.validateQuickWin(item);
                    break;
                case 'kpi':
                    validation = this.validateKPI(item);
                    break;
                default:
                    validation = {
                        valid: false,
                        errors: [`未知的資料類型: ${type}`],
                        warnings: []
                    };
            }
            
            results.push({
                index,
                data: item,
                ...validation
            });
        });
        
        const summary = {
            total: results.length,
            valid: results.filter(r => r.valid).length,
            invalid: results.filter(r => !r.valid).length,
            withWarnings: results.filter(r => r.warnings.length > 0).length,
            results
        };
        
        console.log('[InputValidator] 批次驗證完成:', summary);
        return summary;
    }
    
    /**
     * 檢查日期格式是否有效
     */
    isValidDate(dateString) {
        if (!dateString) return false;
        
        // 支援多種日期格式
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
    
    /**
     * 檢查電子郵件格式
     */
    isValidEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * 檢查 URL 格式
     */
    isValidUrl(url) {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * 清理和標準化資料
     */
    sanitizeData(data, type) {
        const cleaned = { ...data };
        
        // 移除首尾空白
        Object.keys(cleaned).forEach(key => {
            if (typeof cleaned[key] === 'string') {
                cleaned[key] = cleaned[key].trim();
            }
        });
        
        // 標準化狀態值
        if (cleaned.status) {
            cleaned.status = cleaned.status.toLowerCase();
        }
        
        // 標準化數字
        if (cleaned.progress !== undefined) {
            cleaned.progress = parseFloat(cleaned.progress);
        }
        if (cleaned.budget !== undefined) {
            cleaned.budget = parseFloat(cleaned.budget);
        }
        
        // 風險等級標準化
        if (type === 'risk') {
            if (cleaned.probability) {
                cleaned.probability = this.normalizeLevelValue(cleaned.probability);
            }
            if (cleaned.impact) {
                cleaned.impact = this.normalizeLevelValue(cleaned.impact);
            }
        }
        
        return cleaned;
    }
    
    /**
     * 標準化等級值 (low/medium/high 轉為 1-5)
     */
    normalizeLevelValue(value) {
        const levelMap = {
            'low': 2,
            'medium': 3,
            'high': 4
        };
        
        const strValue = String(value).toLowerCase();
        return levelMap[strValue] || value;
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
}

console.log('[InputValidator] 輸入驗證模組已載入');

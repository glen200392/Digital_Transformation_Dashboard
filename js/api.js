/**
 * ============================================================
 * 數位轉型儀表板 - API 呼叫模組
 * 版本: 2.0.0
 * 
 * 負責所有與後端 API 的互動
 * 支援重試機制、快取、超時處理
 * ============================================================
 */

class DashboardAPI {
    constructor(config = CONFIG.api) {
        this.baseUrl = config.baseUrl;
        this.timeout = config.timeout;
        this.retryAttempts = config.retryAttempts;
        this.retryDelay = config.retryDelay;
        this.cacheExpiry = config.cacheExpiry;
        this.cache = new Map();
        
        console.log('[API] DashboardAPI 已初始化');
    }
    
    /**
     * 發送 HTTP 請求（含重試機制）
     */
    async request(endpoint = '', params = {}, attempt = 1) {
        const url = this.buildUrl(endpoint, params);
        const cacheKey = url;
        
        // 檢查快取
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('[API] 使用快取資料:', cacheKey);
            return cached;
        }
        
        try {
            console.log(`[API] 請求 (嘗試 ${attempt}/${this.retryAttempts}):`, url);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 儲存到快取
            this.saveToCache(cacheKey, data);
            
            console.log('[API] 請求成功:', cacheKey);
            return data;
            
        } catch (error) {
            console.error(`[API] 請求失敗 (嘗試 ${attempt}):`, error.message);
            
            // 如果還有重試次數，則重試
            if (attempt < this.retryAttempts) {
                console.log(`[API] ${this.retryDelay}ms 後重試...`);
                await this.delay(this.retryDelay);
                return this.request(endpoint, params, attempt + 1);
            }
            
            // 所有重試都失敗，拋出錯誤
            throw new Error(`API 請求失敗: ${error.message}`);
        }
    }
    
    /**
     * 建立完整 URL
     */
    buildUrl(endpoint, params) {
        const url = new URL(this.baseUrl);
        
        if (endpoint) {
            url.searchParams.append('action', endpoint);
        }
        
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        return url.toString();
    }
    
    /**
     * 從快取取得資料
     */
    getFromCache(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        const now = Date.now();
        if (now - item.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    /**
     * 儲存資料到快取
     */
    saveToCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    /**
     * 清除快取
     */
    clearCache() {
        this.cache.clear();
        console.log('[API] 快取已清除');
    }
    
    /**
     * 延遲函數
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==================== API 端點方法 ====================
    
    /**
     * 取得完整儀表板資料
     */
    async getFullData() {
        try {
            return await this.request('getFullData');
        } catch (error) {
            console.error('[API] 取得完整資料失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得 KPI 資料
     */
    async getKPI() {
        try {
            return await this.request('getKPI');
        } catch (error) {
            console.error('[API] 取得 KPI 失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得專案列表
     */
    async getProjects(filter = null) {
        try {
            const params = filter ? { filter } : {};
            return await this.request('getProjects', params);
        } catch (error) {
            console.error('[API] 取得專案列表失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得風險資料
     */
    async getRisks() {
        try {
            return await this.request('getRisks');
        } catch (error) {
            console.error('[API] 取得風險資料失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得能力建設資料
     */
    async getCapability() {
        try {
            return await this.request('getCapability');
        } catch (error) {
            console.error('[API] 取得能力建設資料失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得備份清單
     */
    async getBackupList() {
        try {
            return await this.request('getBackupList');
        } catch (error) {
            console.error('[API] 取得備份清單失敗:', error);
            throw error;
        }
    }
    
    /**
     * 取得審計日誌
     */
    async getAuditLog(days = 7) {
        try {
            return await this.request('getAuditLog', { days });
        } catch (error) {
            console.error('[API] 取得審計日誌失敗:', error);
            throw error;
        }
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardAPI;
}

console.log('[API] API 模組已載入');

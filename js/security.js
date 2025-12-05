/**
 * ============================================================
 * 數位轉型儀表板 - 安全性模組
 * 版本: 2.1.0
 * 
 * 提供 XSS 防護、輸入驗證、速率限制等安全功能
 * ============================================================
 */

/**
 * RateLimiter 類別 - 請求速率限制器
 */
class RateLimiter {
    constructor(maxRequests = 60, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
        console.log(`[RateLimiter] 已初始化 (最大請求數: ${maxRequests}/${windowMs}ms)`);
    }
    
    /**
     * 檢查是否超過速率限制
     */
    checkLimit(identifier = 'default') {
        const now = Date.now();
        
        // 移除過期的請求記錄
        this.requests = this.requests.filter(req => 
            now - req.timestamp < this.windowMs
        );
        
        // 計算該識別符的請求數
        const userRequests = this.requests.filter(req => req.identifier === identifier);
        
        if (userRequests.length >= this.maxRequests) {
            console.warn(`[RateLimiter] 速率限制觸發: ${identifier}`);
            return false;
        }
        
        // 記錄新請求
        this.requests.push({
            identifier,
            timestamp: now
        });
        
        return true;
    }
    
    /**
     * 重置限制器
     */
    reset() {
        this.requests = [];
        console.log('[RateLimiter] 已重置');
    }
    
    /**
     * 取得剩餘請求數
     */
    getRemainingRequests(identifier = 'default') {
        const now = Date.now();
        const userRequests = this.requests.filter(req => 
            req.identifier === identifier && 
            now - req.timestamp < this.windowMs
        );
        return Math.max(0, this.maxRequests - userRequests.length);
    }
}

/**
 * Security 類別 - 安全性功能集合
 */
class Security {
    constructor(config = CONFIG?.security) {
        this.config = config || {
            enableXSSProtection: true,
            enableRateLimiting: true,
            maxRequestsPerMinute: 60
        };
        
        // 初始化速率限制器
        if (this.config.enableRateLimiting) {
            this.rateLimiter = new RateLimiter(
                this.config.maxRequestsPerMinute || 60,
                60000
            );
        }
        
        console.log('[Security] Security 模組已初始化');
    }
    
    /**
     * XSS 防護 - 轉義 HTML 特殊字元
     */
    escapeHtml(str) {
        if (typeof str !== 'string') return str;
        
        const htmlEscapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'\/]/g, char => htmlEscapeMap[char]);
    }
    
    /**
     * 清理使用者輸入
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // 移除控制字元
        let sanitized = input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        
        // 限制長度
        const maxLength = 10000;
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        // 移除潛在的腳本注入
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        return sanitized.trim();
    }
    
    /**
     * URL 格式驗證
     */
    validateUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        
        try {
            const urlObj = new URL(url);
            
            // 只允許 http 和 https 協議
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                console.warn('[Security] 不允許的 URL 協議:', urlObj.protocol);
                return false;
            }
            
            // 檢查是否為可疑的 URL
            const suspiciousPatterns = [
                /javascript:/i,
                /data:/i,
                /vbscript:/i,
                /file:/i
            ];
            
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(url)) {
                    console.warn('[Security] 可疑的 URL 模式:', url);
                    return false;
                }
            }
            
            return true;
            
        } catch (error) {
            console.warn('[Security] 無效的 URL:', url);
            return false;
        }
    }
    
    /**
     * 生成隨機 nonce 值
     */
    generateNonce(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let nonce = '';
        
        // 使用 crypto API (如果可用)
        if (window.crypto && window.crypto.getRandomValues) {
            const values = new Uint8Array(length);
            window.crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                nonce += chars[values[i] % chars.length];
            }
        } else {
            // 降級使用 Math.random
            for (let i = 0; i < length; i++) {
                nonce += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return nonce;
    }
    
    /**
     * 速率限制檢查
     */
    checkRateLimit(identifier = 'default') {
        if (!this.config.enableRateLimiting || !this.rateLimiter) {
            return true;
        }
        
        return this.rateLimiter.checkLimit(identifier);
    }
    
    /**
     * 敏感資料遮罩
     */
    maskSensitiveData(data, fields = []) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        
        const masked = { ...data };
        
        fields.forEach(field => {
            if (masked[field]) {
                const value = String(masked[field]);
                if (value.length > 4) {
                    // 保留前後各 2 個字元，中間用 * 遮罩
                    masked[field] = value.substring(0, 2) + 
                                   '*'.repeat(value.length - 4) + 
                                   value.substring(value.length - 2);
                } else {
                    masked[field] = '*'.repeat(value.length);
                }
            }
        });
        
        return masked;
    }
    
    /**
     * 取得剩餘請求數
     */
    getRemainingRequests(identifier = 'default') {
        if (!this.rateLimiter) return -1;
        return this.rateLimiter.getRemainingRequests(identifier);
    }
    
    /**
     * 重置速率限制器
     */
    resetRateLimit() {
        if (this.rateLimiter) {
            this.rateLimiter.reset();
        }
    }
    
    /**
     * 驗證資料完整性（簡單的雜湊檢查）
     */
    generateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash.toString(16);
    }
    
    /**
     * 驗證 Checksum
     */
    verifyChecksum(data, expectedChecksum) {
        const actualChecksum = this.generateChecksum(data);
        return actualChecksum === expectedChecksum;
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Security, RateLimiter };
}

console.log('[Security] Security 模組已載入');

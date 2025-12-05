# 安全性文件 (Security Documentation)

本文件說明數位轉型儀表板的安全性設計、實作的防護措施、檢查清單及已知風險。

## 目錄

- [安全性設計原則](#安全性設計原則)
- [已實作的防護措施](#已實作的防護措施)
- [安全性設定](#安全性設定)
- [安全檢查清單](#安全檢查清單)
- [已知風險和緩解措施](#已知風險和緩解措施)
- [安全性最佳實踐](#安全性最佳實踐)
- [事件回應](#事件回應)

---

## 安全性設計原則

### 1. 深度防禦 (Defense in Depth)

實作多層安全機制，即使一層被突破，其他層仍能提供保護：

- **輸入驗證** → **XSS 防護** → **CSP** → **審計日誌**

### 2. 最小權限原則 (Principle of Least Privilege)

- 唯讀操作為主，寫入操作需要確認
- localStorage 僅用於備份和日誌，不儲存敏感資料

### 3. 安全預設 (Secure by Default)

- 所有安全功能預設啟用
- XSS 防護自動應用於所有動態內容
- 速率限制預設開啟

### 4. 失敗安全 (Fail Secure)

- API 失敗時降級到離線模式
- 資料驗證失敗時拒絕載入
- 備份失敗時記錄錯誤但不中斷服務

---

## 已實作的防護措施

### 1. XSS (Cross-Site Scripting) 防護

#### 實作方式

```javascript
// Security.escapeHtml() 轉義所有 HTML 特殊字元
class Security {
    escapeHtml(str) {
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
}
```

#### 應用位置

- ✅ `ui.js` - 所有動態內容使用 `escapeHtml()`
- ✅ Quick Wins 列表
- ✅ 專案表格
- ✅ 通知訊息
- ✅ 使用者輸入

#### 測試

```javascript
// 測試 XSS 防護
const security = new Security();
const malicious = '<script>alert("XSS")</script>';
const safe = security.escapeHtml(malicious);
// 結果: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### 2. Content Security Policy (CSP)

#### 設定

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               connect-src 'self' https://script.google.com;">
```

#### 政策說明

| 指令 | 設定 | 說明 |
|------|------|------|
| `default-src` | 'self' | 預設只允許同源資源 |
| `script-src` | 'self' 'unsafe-inline' cdn.jsdelivr.net | 允許本地腳本、內聯腳本和 Chart.js CDN |
| `style-src` | 'self' 'unsafe-inline' | 允許本地樣式和內聯樣式 |
| `img-src` | 'self' data: | 允許本地圖片和 data URLs |
| `connect-src` | 'self' script.google.com | 允許連接到 API 端點 |

**注意**: `'unsafe-inline'` 是為了向後兼容，未來應該移除並使用 nonce。

### 3. 速率限制 (Rate Limiting)

#### 實作方式

```javascript
class RateLimiter {
    constructor(maxRequests = 60, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    
    checkLimit(identifier) {
        // 檢查請求頻率
        // 超過限制返回 false
    }
}
```

#### 預設設定

- **最大請求數**: 60 次/分鐘
- **適用範圍**: API 請求
- **識別方式**: 基於識別符（預設 'api'）

#### 繞過限制的風險

⚠️ 速率限制僅在客戶端實作，可被繞過。生產環境應在伺服器端實作。

### 4. 輸入驗證和清理

#### Security.sanitizeInput()

```javascript
sanitizeInput(input) {
    // 1. 移除控制字元
    let sanitized = input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    
    // 2. 限制長度
    if (sanitized.length > 10000) {
        sanitized = sanitized.substring(0, 10000);
    }
    
    // 3. 移除潛在的腳本注入
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    return sanitized.trim();
}
```

#### Security.validateUrl()

```javascript
validateUrl(url) {
    // 1. 只允許 http 和 https
    // 2. 拒絕 javascript:, data:, vbscript:, file:
    // 3. 驗證 URL 格式
}
```

### 5. Subresource Integrity (SRI)

#### Chart.js CDN

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" 
        integrity="sha384-OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb" 
        crossorigin="anonymous">
</script>
```

#### 驗證

外部資源載入前驗證 hash，確保未被竄改。

### 6. 審計日誌 (Audit Logging)

#### 記錄的操作

- `DATA_LOAD` - 資料載入
- `DATA_REFRESH` - 資料刷新
- `LAYER_SWITCH` - Layer 切換
- `TAB_SWITCH` - Tab 切換
- `BACKUP_CREATE` - 建立備份
- `BACKUP_RESTORE` - 還原備份
- `ERROR` - 錯誤發生
- `SECURITY_VIOLATION` - 安全違規
- `RATE_LIMIT_EXCEEDED` - 超過速率限制

#### 敏感資訊處理

```javascript
sanitizeDetails(details) {
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
}
```

#### 日誌保留

- **預設保留期**: 30 天
- **自動清理**: 啟動時和定期執行
- **匯出功能**: 支援 JSON 和 CSV 格式

### 7. 資料完整性驗證

#### Checksum 驗證

```javascript
generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}
```

#### 應用

- 備份資料建立時生成 checksum
- 還原資料時驗證 checksum
- 檢測資料是否被竄改

---

## 安全性設定

### config.js 設定項

```javascript
security: {
    enableXSSProtection: true,         // XSS 防護
    enableRateLimiting: true,          // 速率限制
    maxRequestsPerMinute: 60,          // 每分鐘最大請求數
    enableAuditLog: true,              // 審計日誌
    auditLogRetentionDays: 30          // 日誌保留天數
},

dataProtection: {
    enableAutoBackup: true,            // 自動備份
    maxBackupVersions: 5,              // 最大備份版本數
    confirmBeforeDelete: true,         // 刪除前確認
    enableDataValidation: true         // 資料驗證
}
```

### 調整安全級別

#### 高安全性設定

```javascript
security: {
    enableXSSProtection: true,
    enableRateLimiting: true,
    maxRequestsPerMinute: 30,          // 更嚴格的限制
    enableAuditLog: true,
    auditLogRetentionDays: 90          // 更長的保留期
}
```

#### 開發環境設定

```javascript
security: {
    enableXSSProtection: true,         // 保持開啟
    enableRateLimiting: false,         // 關閉以便測試
    enableAuditLog: true,
    auditLogRetentionDays: 7           // 較短的保留期
}
```

---

## 安全檢查清單

### 部署前檢查

- [ ] ✅ XSS 防護已啟用
- [ ] ✅ CSP 標籤已設定
- [ ] ✅ SRI hash 正確無誤
- [ ] ✅ 速率限制已啟用
- [ ] ✅ 審計日誌已啟用
- [ ] ✅ 資料驗證已啟用
- [ ] ✅ 所有動態內容使用 escapeHtml()
- [ ] ⚠️ HTTPS 連線（生產環境必須）
- [ ] ⚠️ 伺服器端速率限制（建議）
- [ ] ⚠️ API 認證機制（建議）

### 定期安全檢查

#### 每週

- [ ] 檢查審計日誌是否有異常活動
- [ ] 驗證備份功能正常運作
- [ ] 檢查 Console 是否有安全警告

#### 每月

- [ ] 審查安全設定
- [ ] 更新依賴套件
- [ ] 檢查 CSP 違規報告（如有設定）
- [ ] 測試 XSS 防護

#### 每季

- [ ] 完整安全審計
- [ ] 滲透測試（建議）
- [ ] 更新安全文件
- [ ] 審查權限設定

---

## 已知風險和緩解措施

### 高風險

#### 1. 客戶端速率限制可被繞過

**風險等級**: 🔴 高

**描述**: 速率限制僅在客戶端實作，攻擊者可以修改或繞過。

**緩解措施**:
- ✅ 已實作基本的客戶端限制
- ⚠️ **建議**: 在伺服器端實作速率限制
- ⚠️ **建議**: 使用 IP 位址追蹤
- ⚠️ **建議**: 實作 API 金鑰認證

**狀態**: 部分緩解，需要伺服器端支援

#### 2. localStorage 資料可被讀取

**風險等級**: 🟡 中

**描述**: localStorage 中的備份和日誌可被其他腳本讀取。

**緩解措施**:
- ✅ 不儲存敏感資料（密碼、token）
- ✅ 日誌中敏感欄位已遮罩
- ⚠️ **建議**: 考慮加密儲存
- ⚠️ **建議**: 使用 httpOnly cookies（需伺服器支援）

**狀態**: 已緩解，可進一步改善

### 中風險

#### 3. CSP 允許 'unsafe-inline'

**風險等級**: 🟡 中

**描述**: CSP 設定允許內聯腳本，降低了 XSS 防護效果。

**緩解措施**:
- ✅ 已實作 escapeHtml() 雙重防護
- ⚠️ **未來改善**: 使用 nonce-based CSP
- ⚠️ **未來改善**: 移除所有內聯腳本

**範例改善**:
```html
<!-- 生成隨機 nonce -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'nonce-{RANDOM_NONCE}' https://cdn.jsdelivr.net">

<!-- 使用 nonce -->
<script nonce="{RANDOM_NONCE}">
    // 內聯腳本
</script>
```

**狀態**: 已知問題，計畫改善

#### 4. 第三方 CDN 依賴

**風險等級**: 🟡 中

**描述**: 依賴 Chart.js CDN，如果 CDN 被入侵或離線會影響功能。

**緩解措施**:
- ✅ 使用 SRI 驗證完整性
- ✅ 實作 onerror 備用處理
- ✅ 顯示友善錯誤訊息
- ⚠️ **建議**: 提供本地備用版本

**狀態**: 已緩解

### 低風險

#### 5. 審計日誌可被清除

**風險等級**: 🟢 低

**描述**: 使用者可以清除瀏覽器資料，導致日誌遺失。

**緩解措施**:
- ✅ 日誌僅用於本地追蹤
- ⚠️ **建議**: 定期匯出日誌到伺服器

**狀態**: 接受風險

---

## 安全性最佳實踐

### 開發時

1. **永遠驗證和清理輸入**
   ```javascript
   const userInput = security.sanitizeInput(rawInput);
   ```

2. **使用 escapeHtml() 處理動態內容**
   ```javascript
   element.innerHTML = `<div>${security.escapeHtml(data.name)}</div>`;
   ```

3. **驗證 URL**
   ```javascript
   if (security.validateUrl(url)) {
       // 安全的 URL
   }
   ```

4. **檢查速率限制**
   ```javascript
   if (!security.checkRateLimit('api')) {
       throw new Error('請求頻率過高');
   }
   ```

5. **記錄重要操作**
   ```javascript
   auditLogger.log('IMPORTANT_ACTION', { details });
   ```

### 部署時

1. **使用 HTTPS**
   - 所有通訊必須加密
   - 設定 HSTS 標頭

2. **設定伺服器端安全標頭**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Referrer-Policy: strict-origin-when-cross-origin
   ```

3. **實作 API 認證**
   - 使用 API 金鑰或 OAuth
   - 實作伺服器端速率限制

4. **定期更新依賴**
   ```bash
   # 檢查 Chart.js 新版本
   npm outdated chart.js
   ```

### 監控

1. **定期檢查日誌**
   ```javascript
   const stats = auditLogger.getLogStatistics();
   console.table(stats.actionCounts);
   ```

2. **設定警報**
   - 異常的請求頻率
   - 大量錯誤
   - 安全違規

---

## 事件回應

### 發現 XSS 漏洞

1. **立即行動**
   - 識別受影響的頁面
   - 修復漏洞
   - 部署修復

2. **通知**
   - 通知使用者清除快取
   - 發布安全公告

3. **審查**
   - 檢查審計日誌
   - 評估影響範圍

### 資料洩露

1. **立即行動**
   - 隔離受影響的系統
   - 停止資料傳輸

2. **調查**
   - 查看審計日誌
   - 確定洩露範圍

3. **修復**
   - 修復漏洞
   - 加強安全措施

### 服務中斷

1. **降級**
   - 啟用離線模式
   - 使用備用資料

2. **溝通**
   - 通知使用者
   - 提供狀態更新

3. **恢復**
   - 修復問題
   - 驗證服務正常

---

## 聯絡資訊

### 報告安全問題

請勿公開披露安全漏洞。請透過以下方式回報：

- **Email**: security@example.com
- **GitHub**: 私下報告（Security Advisory）

### 安全更新

訂閱以獲取安全更新：
- GitHub Watch (Releases only)
- [CHANGELOG.md](../CHANGELOG.md)

---

**文件版本**: 2.1.0  
**最後更新**: 2025-12-05  
**下次審查**: 2026-03-05  
**負責人**: Security Team

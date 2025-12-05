/**
 * ============================================================
 * 數位轉型儀表板 - 狀態管理模組
 * 版本: 2.0.0
 * 
 * 負責管理應用程式狀態
 * 支援訂閱機制、localStorage 持久化、狀態歷史
 * ============================================================
 */

class StateManager {
    constructor(config = CONFIG) {
        // 初始狀態
        this.state = {
            data: null,                    // 儀表板資料
            isLoading: false,              // 載入狀態
            error: null,                   // 錯誤訊息
            currentLayer: config.ui.defaultLayer,  // 當前 Layer
            currentDetailTab: config.ui.defaultDetailTab,  // 當前詳細分析 Tab
            filters: {                     // 篩選器
                project: 'all',
                risk: 'all',
                department: 'all'
            },
            preferences: this.loadPreferences(),  // 使用者偏好設定
            lastUpdate: null,              // 最後更新時間
            isOnline: navigator.onLine     // 線上/離線狀態
        };
        
        // 訂閱者列表
        this.subscribers = [];
        
        // 狀態歷史（用於 undo）
        this.history = [];
        this.maxHistoryLength = 10;
        
        // 監聽網路狀態
        this.setupNetworkListeners();
        
        console.log('[State] StateManager 已初始化');
    }
    
    /**
     * 取得當前狀態
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * 更新狀態
     */
    setState(updates, saveHistory = true) {
        // 儲存歷史
        if (saveHistory) {
            this.saveHistory();
        }
        
        // 更新狀態
        const oldState = { ...this.state };
        this.state = {
            ...this.state,
            ...updates
        };
        
        console.log('[State] 狀態已更新:', updates);
        
        // 通知所有訂閱者
        this.notifySubscribers(oldState, this.state);
    }
    
    /**
     * 訂閱狀態變化
     */
    subscribe(callback) {
        if (typeof callback !== 'function') {
            throw new Error('訂閱回調必須是函數');
        }
        
        this.subscribers.push(callback);
        
        // 返回取消訂閱函數
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }
    
    /**
     * 通知所有訂閱者
     */
    notifySubscribers(oldState, newState) {
        this.subscribers.forEach(callback => {
            try {
                callback(newState, oldState);
            } catch (error) {
                console.error('[State] 訂閱者回調錯誤:', error);
            }
        });
    }
    
    /**
     * 設定載入狀態
     */
    setLoading(isLoading) {
        this.setState({ isLoading });
    }
    
    /**
     * 設定錯誤
     */
    setError(error) {
        this.setState({ 
            error: error ? error.toString() : null,
            isLoading: false
        });
    }
    
    /**
     * 設定資料
     */
    setData(data) {
        this.setState({ 
            data,
            error: null,
            isLoading: false,
            lastUpdate: new Date().toISOString()
        });
    }
    
    /**
     * 設定當前 Layer
     */
    setCurrentLayer(layer) {
        if (layer >= 1 && layer <= 3) {
            this.setState({ currentLayer: layer });
        }
    }
    
    /**
     * 設定當前詳細分析 Tab
     */
    setCurrentDetailTab(tab) {
        this.setState({ currentDetailTab: tab });
    }
    
    /**
     * 設定篩選器
     */
    setFilter(filterName, value) {
        this.setState({
            filters: {
                ...this.state.filters,
                [filterName]: value
            }
        });
    }
    
    /**
     * 重設篩選器
     */
    resetFilters() {
        this.setState({
            filters: {
                project: 'all',
                risk: 'all',
                department: 'all'
            }
        });
    }
    
    /**
     * 更新偏好設定
     */
    updatePreferences(preferences) {
        const newPreferences = {
            ...this.state.preferences,
            ...preferences
        };
        
        this.setState({ preferences: newPreferences });
        this.savePreferences(newPreferences);
    }
    
    /**
     * 載入偏好設定（從 localStorage）
     */
    loadPreferences() {
        try {
            const key = CONFIG.storage.prefix + CONFIG.storage.keys.preferences;
            const stored = localStorage.getItem(key);
            
            if (stored) {
                const preferences = JSON.parse(stored);
                console.log('[State] 已載入偏好設定:', preferences);
                return preferences;
            }
        } catch (error) {
            console.error('[State] 載入偏好設定失敗:', error);
        }
        
        // 預設偏好設定
        return {
            theme: CONFIG.ui.theme,
            language: CONFIG.ui.language,
            autoRefresh: CONFIG.refresh.enabled,
            notifications: CONFIG.refresh.showNotification
        };
    }
    
    /**
     * 儲存偏好設定（到 localStorage）
     */
    savePreferences(preferences) {
        try {
            const key = CONFIG.storage.prefix + CONFIG.storage.keys.preferences;
            localStorage.setItem(key, JSON.stringify(preferences));
            console.log('[State] 偏好設定已儲存');
        } catch (error) {
            console.error('[State] 儲存偏好設定失敗:', error);
        }
    }
    
    /**
     * 儲存狀態歷史
     */
    saveHistory() {
        this.history.push({ ...this.state });
        
        // 限制歷史長度
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }
    
    /**
     * 復原到上一個狀態
     */
    undo() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.state = previousState;
            this.notifySubscribers(this.state, previousState);
            console.log('[State] 已復原到上一個狀態');
        } else {
            console.warn('[State] 無歷史可復原');
        }
    }
    
    /**
     * 清除歷史
     */
    clearHistory() {
        this.history = [];
        console.log('[State] 歷史已清除');
    }
    
    /**
     * 設定網路狀態監聽器
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('[State] 網路已連線');
            this.setState({ isOnline: true });
        });
        
        window.addEventListener('offline', () => {
            console.log('[State] 網路已離線');
            this.setState({ isOnline: false });
        });
    }
    
    /**
     * 取得特定狀態值
     */
    get(key) {
        return this.state[key];
    }
    
    /**
     * 檢查是否載入中
     */
    isLoading() {
        return this.state.isLoading;
    }
    
    /**
     * 檢查是否有錯誤
     */
    hasError() {
        return this.state.error !== null;
    }
    
    /**
     * 檢查是否有資料
     */
    hasData() {
        return this.state.data !== null;
    }
    
    /**
     * 檢查是否在線
     */
    isOnline() {
        return this.state.isOnline;
    }
    
    /**
     * 重設狀態
     */
    reset() {
        this.setState({
            data: null,
            isLoading: false,
            error: null,
            currentLayer: CONFIG.ui.defaultLayer,
            currentDetailTab: CONFIG.ui.defaultDetailTab,
            lastUpdate: null
        }, false);
        
        this.clearHistory();
        console.log('[State] 狀態已重設');
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}

console.log('[State] State 模組已載入');

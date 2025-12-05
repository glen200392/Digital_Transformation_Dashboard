/**
 * ============================================================
 * 數位轉型儀表板 - 主程式入口
 * 版本: 2.0.0
 * 
 * 整合所有模組，管理應用程式生命週期
 * ============================================================
 */

class DashboardApp {
    constructor() {
        // 初始化所有模組
        this.security = new Security();
        this.auditLogger = new AuditLogger();
        this.dataProtection = new DataProtection();
        this.api = new DashboardAPI();
        this.state = new StateManager();
        this.charts = new ChartManager();
        this.ui = new UIManager();
        
        // 自動刷新計時器
        this.refreshTimer = null;
        
        console.log('[App] DashboardApp 已初始化');
    }
    
    /**
     * 初始化應用程式
     */
    async init() {
        console.log('[App] 開始初始化應用程式...');
        
        try {
            // 設定事件監聽器
            this.setupEventListeners();
            
            // 訂閱狀態變化
            this.subscribeToState();
            
            // 載入初始資料
            await this.loadData();
            
            // 啟動自動刷新
            if (CONFIG.features.enableAutoRefresh && CONFIG.refresh.enabled) {
                this.startAutoRefresh();
            }
            
            console.log('[App] 應用程式初始化完成');
            this.ui.showNotification('儀表板已就緒', 'success');
            
        } catch (error) {
            console.error('[App] 初始化失敗:', error);
            this.handleError(error);
        }
    }
    
    /**
     * 載入資料
     */
    async loadData(useCache = true) {
        console.log('[App] 開始載入資料...');
        
        // 記錄操作
        this.auditLogger.log(this.auditLogger.ActionTypes.DATA_LOAD, {
            useCache: useCache,
            timestamp: new Date().toISOString()
        });
        
        this.state.setLoading(true);
        this.ui.showLoading('正在從伺服器載入資料...');
        
        // 顯示連接中狀態
        this.ui.updateSyncStatus('connecting');
        
        try {
            // 如果不使用快取，先清除
            if (!useCache) {
                this.api.clearCache();
                this.auditLogger.log(this.auditLogger.ActionTypes.DATA_REFRESH, {
                    manual: true
                });
            }
            
            // 載入完整資料
            const data = await this.api.getFullData();
            
            // 驗證資料
            if (this.dataProtection.config.enableDataValidation) {
                const isValid = this.dataProtection.validateData(data);
                if (!isValid) {
                    throw new Error('資料驗證失敗');
                }
            }
            
            // 自動備份資料
            if (this.dataProtection.config.enableAutoBackup) {
                this.dataProtection.createBackup(data, '自動備份');
                this.auditLogger.log(this.auditLogger.ActionTypes.BACKUP_CREATE, {
                    auto: true
                });
            }
            
            // 更新狀態
            this.state.setData(data);
            
            // 更新 UI
            this.updateUI(data);
            
            // 更新最後刷新時間
            this.ui.updateLastRefreshTime(new Date());
            
            console.log('[App] 資料載入成功');
            
        } catch (error) {
            console.error('[App] 資料載入失敗:', error);
            
            // 記錄錯誤
            this.auditLogger.log(this.auditLogger.ActionTypes.ERROR, {
                error: error.message,
                context: 'loadData'
            });
            
            // 嘗試載入離線資料
            if (CONFIG.features.enableOfflineMode) {
                await this.loadFallbackData();
            } else {
                this.state.setError(error);
                this.ui.showNotification('無法載入資料', 'error');
            }
            
        } finally {
            this.state.setLoading(false);
            this.ui.hideLoading();
        }
    }
    
    /**
     * 載入離線備用資料
     */
    async loadFallbackData() {
        console.log('[App] 嘗試載入離線備用資料...');
        
        try {
            const fallbackPath = CONFIG?.api?.fallbackDataPath || 'data/fallback.json';
            const response = await fetch(fallbackPath);
            const data = await response.json();
            
            this.state.setData(data);
            this.updateUI(data);
            
            // 更新為離線狀態
            this.ui.updateSyncStatus('fallback');
            
            this.ui.showNotification('已載入離線備用資料', 'warning');
            console.log('[App] 離線資料載入成功');
            
        } catch (error) {
            console.error('[App] 離線資料載入失敗:', error);
            this.state.setError('無法連接伺服器且沒有可用的離線資料');
            this.ui.showNotification('無法載入資料', 'error');
        }
    }
    
    /**
     * 更新 UI
     */
    updateUI(data) {
        // 更新設定（標題、團隊名稱）
        if (data.settings) {
            this.ui.updateSettings(data.settings);
        }
        
        // 更新元資料（同步狀態）
        if (data.metadata) {
            this.ui.updateMetadata(data.metadata);
        }
        
        const currentLayer = this.state.get('currentLayer');
        
        // 更新對應的 Layer
        switch (currentLayer) {
            case 1:
                this.ui.updateLayer1KPI(data);
                break;
            case 2:
                this.ui.updateLayer2Dashboard(data);
                this.initializeLayer2Charts(data);
                break;
            case 3:
                this.ui.updateLayer3Details(data);
                this.initializeLayer3Charts(data);
                break;
        }
    }
    
    /**
     * 初始化 Layer 2 圖表
     */
    initializeLayer2Charts(data) {
        if (data.charts) {
            if (data.charts.radar) {
                this.charts.initRadarChart('radar-chart', data.charts.radar);
            }
            if (data.charts.burndown) {
                this.charts.initBurndownChart('burndown-chart', data.charts.burndown);
            }
        }
    }
    
    /**
     * 初始化 Layer 3 圖表
     */
    initializeLayer3Charts(data) {
        if (data.charts) {
            if (data.charts.funnel) {
                this.charts.initFunnelChart('funnel-chart', data.charts.funnel);
            }
            if (data.charts.adoption) {
                this.charts.initAdoptionChart('adoption-chart', data.charts.adoption);
            }
        }
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // Layer 切換
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = parseInt(e.currentTarget.dataset.layer);
                this.switchLayer(layer);
            });
        });
        
        // Detail Tab 切換
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchDetailTab(tabName);
            });
        });
        
        // 手動刷新按鈕
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn && CONFIG.features.enableManualRefresh) {
            refreshBtn.addEventListener('click', () => {
                this.loadData(false);
            });
        }
        
        // Action Buttons
        const riskBtn = document.getElementById('show-risk-details');
        if (riskBtn) {
            riskBtn.addEventListener('click', () => {
                this.showRiskDetails();
            });
        }
        
        const focusBtn = document.getElementById('show-weekly-focus');
        if (focusBtn) {
            focusBtn.addEventListener('click', () => {
                this.showWeeklyFocus();
            });
        }
        
        console.log('[App] 事件監聽器已設定');
    }
    
    /**
     * 訂閱狀態變化
     */
    subscribeToState() {
        this.state.subscribe((newState, oldState) => {
            // 當 Layer 改變時，更新 UI
            if (newState.currentLayer !== oldState.currentLayer) {
                this.onLayerChange(newState.currentLayer);
            }
            
            // 當資料更新時，更新 UI
            if (newState.data !== oldState.data && newState.data) {
                this.updateUI(newState.data);
            }
            
            // 當線上狀態改變時
            if (newState.isOnline !== oldState.isOnline) {
                const message = newState.isOnline ? '網路已連線' : '網路已離線';
                const type = newState.isOnline ? 'success' : 'warning';
                this.ui.showNotification(message, type);
            }
        });
        
        console.log('[App] 已訂閱狀態變化');
    }
    
    /**
     * 切換 Layer
     */
    switchLayer(layer) {
        console.log(`[App] 切換到 Layer ${layer}`);
        
        // 記錄操作
        this.auditLogger.log(this.auditLogger.ActionTypes.LAYER_SWITCH, {
            fromLayer: this.state.get('currentLayer'),
            toLayer: layer
        });
        
        // 更新狀態
        this.state.setCurrentLayer(layer);
        
        // 更新按鈕狀態
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.layer) === layer) {
                btn.classList.add('active');
            }
        });
        
        // 更新 Section 顯示
        document.querySelectorAll('.layer-section').forEach(section => {
            section.classList.remove('active');
            if (parseInt(section.dataset.layer) === layer) {
                section.classList.add('active');
            }
        });
    }
    
    /**
     * Layer 改變時的處理
     */
    onLayerChange(layer) {
        const data = this.state.get('data');
        if (!data) return;
        
        // 根據 Layer 初始化相應的圖表
        if (layer === 2) {
            this.initializeLayer2Charts(data);
        } else if (layer === 3) {
            this.initializeLayer3Charts(data);
        }
    }
    
    /**
     * 切換 Detail Tab
     */
    switchDetailTab(tabName) {
        console.log(`[App] 切換到 Tab: ${tabName}`);
        
        // 記錄操作
        this.auditLogger.log(this.auditLogger.ActionTypes.TAB_SWITCH, {
            fromTab: this.state.get('currentDetailTab'),
            toTab: tabName
        });
        
        // 更新狀態
        this.state.setCurrentDetailTab(tabName);
        
        // 更新 Tab 按鈕狀態
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
        
        // 更新內容顯示
        document.querySelectorAll('.detail-tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.dataset.tab === tabName) {
                content.classList.add('active');
            }
        });
    }
    
    /**
     * 啟動自動刷新
     */
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            console.log('[App] 自動刷新觸發');
            this.loadData(true);
            
            if (CONFIG.refresh.showNotification) {
                this.ui.showNotification('資料已自動更新', 'info', 2000);
            }
        }, CONFIG.refresh.interval);
        
        console.log(`[App] 自動刷新已啟動 (間隔: ${CONFIG.refresh.interval / 1000}秒)`);
    }
    
    /**
     * 停止自動刷新
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            console.log('[App] 自動刷新已停止');
        }
    }
    
    /**
     * 顯示風險詳情
     */
    showRiskDetails() {
        console.log('[App] 顯示風險詳情');
        this.switchLayer(2);
        
        // 滾動到風險區域
        const riskSection = document.getElementById('risk-heatmap');
        if (riskSection) {
            riskSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * 顯示本週重點
     */
    showWeeklyFocus() {
        console.log('[App] 顯示本週重點');
        this.switchLayer(2);
        
        // 滾動到 Quick Wins 區域
        const quickWinsSection = document.getElementById('quick-wins');
        if (quickWinsSection) {
            quickWinsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * 處理錯誤
     */
    handleError(error) {
        console.error('[App] 應用程式錯誤:', error);
        this.state.setError(error);
        this.ui.showNotification('發生錯誤: ' + error.message, 'error', 5000);
    }
    
    /**
     * 銷毀應用程式
     */
    destroy() {
        console.log('[App] 銷毀應用程式...');
        
        // 停止自動刷新
        this.stopAutoRefresh();
        
        // 銷毀所有圖表
        this.charts.destroyAll();
        
        // 清除快取
        this.api.clearCache();
        
        // 重設狀態
        this.state.reset();
        
        console.log('[App] 應用程式已銷毀');
    }
}

// ==================== 應用程式啟動 ====================

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] DOM 已載入，啟動應用程式...');
    
    // 建立並初始化應用程式
    window.dashboardApp = new DashboardApp();
    window.dashboardApp.init();
});

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardApp;
}

console.log('[App] App 模組已載入');

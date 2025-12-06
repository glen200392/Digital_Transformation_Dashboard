/**
 * ============================================================
 * 數位轉型儀表板 - 資料輸入管理器（主控制器）
 * 版本: 1.0.0
 * 
 * 整合所有資料輸入功能：
 * - Excel/CSV 檔案導入
 * - 前端表單輸入
 * - AI 服務（預留）
 * ============================================================
 */

class DataInputManager {
    constructor(api, validator) {
        this.api = api;
        this.validator = validator;
        this.fileImport = new FileImport(validator);
        this.formManager = new FormManager(validator, api);
        this.aiConnector = new AIConnector();
        
        this.isInitialized = false;
        this.currentMode = null; // 'file' | 'form' | 'ai'
        
        console.log('[DataInputManager] 資料輸入管理器已初始化');
    }
    
    /**
     * 初始化資料輸入功能
     */
    init() {
        if (this.isInitialized) {
            console.warn('[DataInputManager] 已經初始化');
            return;
        }
        
        this.setupUI();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('[DataInputManager] 資料輸入功能已啟用');
    }
    
    /**
     * 設定 UI 元素
     */
    setupUI() {
        // 側邊面板已在 HTML 中定義，這裡只需取得參考
        this.panel = document.getElementById('data-input-panel');
        this.overlay = document.getElementById('panel-overlay');
        this.closeBtn = document.getElementById('close-panel');
        this.tabButtons = document.querySelectorAll('.input-tab-btn');
        this.tabContents = document.querySelectorAll('.input-tab-content');
        
        if (!this.panel) {
            console.error('[DataInputManager] 找不到資料輸入面板元素');
        }
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 開啟面板按鈕
        const openBtn = document.getElementById('data-input-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openPanel());
        }
        
        // 關閉面板
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closePanel());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closePanel());
        }
        
        // Tab 切換
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // 表單類型按鈕
        this.setupFormTypeButtons();
        
        // 檔案上傳
        this.setupFileUpload();
        
        // 範本下載按鈕
        this.setupTemplateDownload();
        
        // 監聽資料更新事件
        window.addEventListener('dataUpdated', (e) => {
            console.log('[DataInputManager] 資料已更新:', e.detail);
            // 可以在這裡觸發重新載入資料
        });
    }
    
    /**
     * 設定表單類型按鈕
     */
    setupFormTypeButtons() {
        const buttons = document.querySelectorAll('.form-type-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 確保取得 button 元素的 data-type
                const button = e.currentTarget;
                const formType = button.dataset.type;
                this.showForm(formType);
            });
        });
    }
    
    /**
     * 設定檔案上傳
     */
    setupFileUpload() {
        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-input');
        const dataTypeSelect = document.getElementById('import-data-type');
        
        if (!dropZone || !fileInput || !dataTypeSelect) return;
        
        // 點擊上傳區域
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // 檔案選擇
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const dataType = dataTypeSelect.value;
                this.handleFileUpload(file, dataType);
            }
        });
        
        // 拖放上傳
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                const dataType = dataTypeSelect.value;
                this.handleFileUpload(file, dataType);
            }
        });
    }
    
    /**
     * 設定範本下載
     */
    setupTemplateDownload() {
        const buttons = document.querySelectorAll('.download-template-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateType = e.target.dataset.template;
                this.downloadTemplate(templateType);
            });
        });
    }
    
    /**
     * 開啟側邊面板
     */
    openPanel() {
        if (this.panel && this.overlay) {
            this.panel.classList.add('open');
            this.overlay.classList.add('open');
            console.log('[DataInputManager] 已開啟資料管理面板');
        }
    }
    
    /**
     * 關閉側邊面板
     */
    closePanel() {
        if (this.panel && this.overlay) {
            this.panel.classList.remove('open');
            this.overlay.classList.remove('open');
            console.log('[DataInputManager] 已關閉資料管理面板');
        }
    }
    
    /**
     * 切換 Tab
     */
    switchTab(tabName) {
        // 更新按鈕狀態
        this.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 更新內容顯示
        this.tabContents.forEach(content => {
            if (content.dataset.tab === tabName) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        this.currentMode = tabName;
        console.log('[DataInputManager] 切換到:', tabName);
    }
    
    /**
     * 顯示表單
     */
    showForm(formType) {
        const formContainer = document.getElementById('form-container');
        if (!formContainer) return;
        
        this.formManager.showForm(formType, formContainer);
    }
    
    /**
     * 處理檔案上傳
     */
    async handleFileUpload(file, dataType) {
        console.log('[DataInputManager] 處理檔案上傳:', file.name, dataType);
        
        const previewContainer = document.getElementById('file-preview');
        const importBtn = document.getElementById('confirm-import-btn');
        
        if (!previewContainer) return;
        
        try {
            // 顯示載入狀態
            previewContainer.innerHTML = '<div class="loading">解析檔案中...</div>';
            
            // 解析檔案
            const parsedData = await this.fileImport.parseFile(file, dataType);
            
            // 驗證資料
            const validationResult = this.fileImport.validateParsedData(parsedData);
            
            // 顯示驗證摘要
            const summaryHTML = this.fileImport.generateValidationSummary(validationResult);
            
            // 顯示資料預覽
            const previewHTML = this.fileImport.generatePreviewTable(parsedData, validationResult);
            
            previewContainer.innerHTML = summaryHTML + previewHTML;
            
            // 啟用/停用導入按鈕
            if (importBtn) {
                if (validationResult.valid || validationResult.summary.valid > 0) {
                    importBtn.disabled = false;
                    importBtn.onclick = () => this.confirmImport(parsedData, validationResult);
                } else {
                    importBtn.disabled = true;
                }
            }
            
        } catch (error) {
            console.error('[DataInputManager] 檔案處理失敗:', error);
            previewContainer.innerHTML = `
                <div class="error-message">
                    <p>❌ 檔案處理失敗</p>
                    <p>${error.message}</p>
                </div>
            `;
            if (importBtn) {
                importBtn.disabled = true;
            }
        }
    }
    
    /**
     * 確認導入資料
     */
    async confirmImport(parsedData, validationResult) {
        console.log('[DataInputManager] 確認導入資料');
        
        // 只導入有效的資料
        const validData = parsedData.data.filter((item, index) => {
            const result = validationResult.summary.results[index];
            return result && result.valid;
        });
        
        if (validData.length === 0) {
            alert('沒有有效的資料可以導入');
            return;
        }
        
        const confirmed = confirm(`即將導入 ${validData.length} 筆資料，是否繼續？`);
        if (!confirmed) return;
        
        try {
            // 顯示進度
            const previewContainer = document.getElementById('file-preview');
            const originalContent = previewContainer.innerHTML;
            previewContainer.innerHTML = '<div class="loading">正在導入資料...</div>';
            
            // 呼叫批次導入 API
            const importData = {
                type: parsedData.type,
                mode: CONFIG.dataImport.importMode,
                data: validData
            };
            
            const result = await this.api.bulkImport(importData);
            
            if (result && result.success) {
                alert(`✅ 成功導入 ${validData.length} 筆資料`);
                
                // 清除預覽
                this.fileImport.clearParsedData();
                previewContainer.innerHTML = '';
                document.getElementById('file-input').value = '';
                
                // 觸發資料更新事件
                window.dispatchEvent(new CustomEvent('dataUpdated', { 
                    detail: { type: parsedData.type, count: validData.length } 
                }));
                
                // 關閉面板
                this.closePanel();
                
            } else {
                throw new Error(result?.message || '導入失敗');
            }
            
        } catch (error) {
            console.error('[DataInputManager] 導入失敗:', error);
            alert(`❌ 導入失敗: ${error.message}`);
            
            // 恢復預覽
            const previewContainer = document.getElementById('file-preview');
            previewContainer.innerHTML = originalContent;
        }
    }
    
    /**
     * 下載範本
     */
    downloadTemplate(templateType) {
        console.log('[DataInputManager] 下載範本:', templateType);
        this.fileImport.downloadTemplate(templateType);
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataInputManager;
}

console.log('[DataInputManager] 資料輸入管理器模組已載入');

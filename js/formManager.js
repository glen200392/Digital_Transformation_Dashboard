/**
 * ============================================================
 * 數位轉型儀表板 - 表單管理模組
 * 版本: 1.0.0
 * 
 * 負責管理前端表單輸入功能
 * ============================================================
 */

class FormManager {
    constructor(validator, api) {
        this.validator = validator;
        this.api = api;
        this.currentForm = null;
        
        console.log('[FormManager] 表單管理模組已初始化');
    }
    
    /**
     * 生成專案表單 HTML
     */
    generateProjectForm() {
        return `
            <form id="project-form" class="data-input-form">
                <div class="form-group">
                    <label for="project-name">專案名稱 <span class="required">*</span></label>
                    <input type="text" id="project-name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="project-department">部門 <span class="required">*</span></label>
                    <input type="text" id="project-department" name="department" required>
                </div>
                
                <div class="form-group">
                    <label for="project-status">狀態 <span class="required">*</span></label>
                    <select id="project-status" name="status" required>
                        <option value="">請選擇</option>
                        <option value="planning">規劃中</option>
                        <option value="in_progress">進行中</option>
                        <option value="on_hold">暫停</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="project-progress">進度 (%)</label>
                    <input type="number" id="project-progress" name="progress" min="0" max="100" step="1">
                    <small class="form-hint">0-100 之間的數字</small>
                </div>
                
                <div class="form-group">
                    <label for="project-budget">預算</label>
                    <input type="number" id="project-budget" name="budget" min="0" step="1000">
                    <small class="form-hint">單位: 元</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="project-start-date">開始日期</label>
                        <input type="date" id="project-start-date" name="startDate">
                    </div>
                    
                    <div class="form-group">
                        <label for="project-end-date">結束日期</label>
                        <input type="date" id="project-end-date" name="endDate">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="project-owner">負責人</label>
                    <input type="text" id="project-owner" name="owner">
                </div>
                
                <div class="form-group">
                    <label for="project-description">專案描述</label>
                    <textarea id="project-description" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.formManager.closeForm()">取消</button>
                    <button type="submit" class="btn btn-primary">送出</button>
                </div>
            </form>
        `;
    }
    
    /**
     * 生成風險表單 HTML
     */
    generateRiskForm() {
        return `
            <form id="risk-form" class="data-input-form">
                <div class="form-group">
                    <label for="risk-title">風險標題 <span class="required">*</span></label>
                    <input type="text" id="risk-title" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="risk-category">風險類別 <span class="required">*</span></label>
                    <select id="risk-category" name="category" required>
                        <option value="">請選擇</option>
                        <option value="technical">技術風險</option>
                        <option value="resource">資源風險</option>
                        <option value="schedule">時程風險</option>
                        <option value="financial">財務風險</option>
                        <option value="organizational">組織風險</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="risk-probability">發生機率 <span class="required">*</span></label>
                        <select id="risk-probability" name="probability" required>
                            <option value="">請選擇</option>
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="risk-impact">影響程度 <span class="required">*</span></label>
                        <select id="risk-impact" name="impact" required>
                            <option value="">請選擇</option>
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="risk-status">狀態</label>
                    <select id="risk-status" name="status">
                        <option value="open">開啟</option>
                        <option value="monitoring">監控中</option>
                        <option value="mitigated">已緩解</option>
                        <option value="closed">已關閉</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="risk-owner">負責人</label>
                    <input type="text" id="risk-owner" name="owner">
                </div>
                
                <div class="form-group">
                    <label for="risk-mitigation">緩解措施</label>
                    <textarea id="risk-mitigation" name="mitigation" rows="2"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="risk-description">風險描述</label>
                    <textarea id="risk-description" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.formManager.closeForm()">取消</button>
                    <button type="submit" class="btn btn-primary">送出</button>
                </div>
            </form>
        `;
    }
    
    /**
     * 生成 Quick Win 表單 HTML
     */
    generateQuickWinForm() {
        return `
            <form id="quickwin-form" class="data-input-form">
                <div class="form-group">
                    <label for="quickwin-title">標題 <span class="required">*</span></label>
                    <input type="text" id="quickwin-title" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="quickwin-owner">負責人 <span class="required">*</span></label>
                    <input type="text" id="quickwin-owner" name="owner" required>
                </div>
                
                <div class="form-group">
                    <label for="quickwin-status">狀態</label>
                    <select id="quickwin-status" name="status">
                        <option value="pending">待處理</option>
                        <option value="in_progress">進行中</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="quickwin-hours">預計工時</label>
                        <input type="number" id="quickwin-hours" name="estimatedHours" min="0" step="0.5">
                        <small class="form-hint">單位: 小時</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="quickwin-due-date">到期日</label>
                        <input type="date" id="quickwin-due-date" name="dueDate">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="quickwin-description">描述</label>
                    <textarea id="quickwin-description" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.formManager.closeForm()">取消</button>
                    <button type="submit" class="btn btn-primary">送出</button>
                </div>
            </form>
        `;
    }
    
    /**
     * 生成 KPI 表單 HTML
     */
    generateKPIForm() {
        return `
            <form id="kpi-form" class="data-input-form">
                <div class="form-group">
                    <label for="kpi-metric">指標名稱 <span class="required">*</span></label>
                    <input type="text" id="kpi-metric" name="metric" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="kpi-value">當前值 <span class="required">*</span></label>
                        <input type="number" id="kpi-value" name="value" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="kpi-target">目標值</label>
                        <input type="number" id="kpi-target" name="target" step="0.01">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="kpi-unit">單位</label>
                    <input type="text" id="kpi-unit" name="unit" placeholder="例如: %、分、元">
                </div>
                
                <div class="form-group">
                    <label for="kpi-category">類別</label>
                    <select id="kpi-category" name="category">
                        <option value="overall">整體</option>
                        <option value="financial">財務</option>
                        <option value="operational">營運</option>
                        <option value="customer">客戶</option>
                        <option value="learning">學習成長</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.formManager.closeForm()">取消</button>
                    <button type="submit" class="btn btn-primary">送出</button>
                </div>
            </form>
        `;
    }
    
    /**
     * 顯示表單
     */
    showForm(type, container) {
        let formHTML = '';
        
        switch (type) {
            case 'project':
                formHTML = this.generateProjectForm();
                break;
            case 'risk':
                formHTML = this.generateRiskForm();
                break;
            case 'quickwin':
                formHTML = this.generateQuickWinForm();
                break;
            case 'kpi':
                formHTML = this.generateKPIForm();
                break;
            default:
                console.error('[FormManager] 未知的表單類型:', type);
                return;
        }
        
        container.innerHTML = formHTML;
        this.currentForm = type;
        
        // 綁定表單送出事件
        const form = container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e, type));
        }
        
        console.log('[FormManager] 已顯示表單:', type);
    }
    
    /**
     * 關閉表單
     */
    closeForm() {
        this.currentForm = null;
        // 這個方法會被外部調用來關閉側邊面板
    }
    
    /**
     * 處理表單送出
     */
    async handleSubmit(event, type) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        
        // 轉換 FormData 為物件
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // 清理和標準化資料
        const cleanedData = this.validator.sanitizeData(data, type);
        
        // 驗證資料
        let validation;
        switch (type) {
            case 'project':
                validation = this.validator.validateProject(cleanedData);
                break;
            case 'risk':
                validation = this.validator.validateRisk(cleanedData);
                break;
            case 'quickwin':
                validation = this.validator.validateQuickWin(cleanedData);
                break;
            case 'kpi':
                validation = this.validator.validateKPI(cleanedData);
                break;
        }
        
        if (!validation.valid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        // 顯示警告（如果有）
        if (validation.warnings.length > 0) {
            this.showValidationWarnings(validation.warnings);
        }
        
        // 送出資料
        try {
            this.showLoading(form);
            
            let result;
            switch (type) {
                case 'project':
                    result = await this.api.addProject(cleanedData);
                    break;
                case 'risk':
                    result = await this.api.addRisk(cleanedData);
                    break;
                case 'quickwin':
                    result = await this.api.addQuickWin(cleanedData);
                    break;
                case 'kpi':
                    result = await this.api.updateKPI(cleanedData);
                    break;
            }
            
            this.hideLoading(form);
            
            if (result && result.success) {
                this.showSuccess(`${this.getTypeName(type)}已成功新增`);
                form.reset();
                
                // 觸發自訂事件，通知資料已更新
                window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type } }));
            } else {
                throw new Error(result?.message || '操作失敗');
            }
            
        } catch (error) {
            this.hideLoading(form);
            this.showError(`操作失敗: ${error.message}`);
        }
    }
    
    /**
     * 顯示驗證錯誤
     */
    showValidationErrors(errors) {
        const message = '資料驗證失敗:\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
        alert(message);
    }
    
    /**
     * 顯示驗證警告
     */
    showValidationWarnings(warnings) {
        const message = '注意:\n' + warnings.map((w, i) => `${i + 1}. ${w}`).join('\n');
        console.warn('[FormManager]', message);
    }
    
    /**
     * 顯示成功訊息
     */
    showSuccess(message) {
        // 使用 UI Manager 的通知功能（如果可用）
        if (window.uiManager) {
            window.uiManager.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }
    
    /**
     * 顯示錯誤訊息
     */
    showError(message) {
        if (window.uiManager) {
            window.uiManager.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
    
    /**
     * 顯示載入狀態
     */
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '處理中...';
        }
    }
    
    /**
     * 隱藏載入狀態
     */
    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '送出';
        }
    }
    
    /**
     * 取得類型的中文名稱
     */
    getTypeName(type) {
        const names = {
            project: '專案',
            risk: '風險',
            quickwin: 'Quick Win',
            kpi: 'KPI'
        };
        return names[type] || type;
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormManager;
}

console.log('[FormManager] 表單管理模組已載入');

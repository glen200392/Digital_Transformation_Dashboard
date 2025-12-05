/**
 * ============================================================
 * 數位轉型儀表板 - UI 更新模組
 * 版本: 2.0.0
 * 
 * 負責更新所有 UI 元素
 * ============================================================
 */

class UIManager {
    constructor(config = CONFIG) {
        this.config = config;
        // 初始化 Security 模組用於 XSS 防護
        this.security = window.Security ? new window.Security() : null;
        console.log('[UI] UIManager 已初始化');
    }
    
    /**
     * 安全地轉義 HTML（XSS 防護）
     */
    escapeHtml(str) {
        if (this.security) {
            return this.security.escapeHtml(str);
        }
        // 降級方案
        if (typeof str !== 'string') return str;
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * 更新 Layer 1 - Executive Summary KPI 卡片
     */
    updateLayer1KPI(data) {
        if (!data || !data.kpi) {
            console.warn('[UI] Layer 1 資料不完整');
            return;
        }
        
        const kpi = data.kpi;
        
        // 更新健康度總分
        this.updateElement('health-score', kpi.healthScore || 76);
        this.updateElement('health-trend', this.getTrendIcon(kpi.healthTrend || 'up'));
        
        // 更新 KPI 卡片
        this.updateKPICard('kpi-roi', kpi.roi || 145, this.config.thresholds.roi);
        this.updateKPICard('kpi-progress', kpi.progress || 73, this.config.thresholds.progress);
        this.updateKPICard('kpi-engagement', kpi.engagement || 68, this.config.thresholds.engagement);
        this.updateKPICard('kpi-risks', kpi.highRisks || 0, this.config.thresholds.highRiskMax, true);
        
        console.log('[UI] Layer 1 KPI 已更新');
    }
    
    /**
     * 格式化 KPI 值
     */
    formatKPIValue(id, value) {
        if (typeof value !== 'number') return value;
        const needsPercentage = id.includes('roi') || id.includes('progress') || id.includes('engagement');
        return needsPercentage ? value + '%' : value;
    }
    
    /**
     * 更新單一 KPI 卡片
     */
    updateKPICard(id, value, threshold, inverse = false) {
        const valueElement = document.getElementById(id);
        const statusElement = document.getElementById(id + '-status');
        
        if (valueElement) {
            valueElement.textContent = this.formatKPIValue(id, value);
        }
        
        if (statusElement) {
            const status = this.getStatus(value, threshold, inverse);
            statusElement.className = 'status ' + status;
            statusElement.textContent = this.config.statusColors[status].label;
        }
    }
    
    /**
     * 取得狀態（綠/黃/紅）
     */
    getStatus(value, threshold, inverse = false) {
        if (!threshold) return 'yellow';
        
        const { green, yellow } = threshold;
        
        if (inverse) {
            // 數值越低越好（如風險）
            if (value <= green) return 'green';
            if (value <= yellow) return 'yellow';
            return 'red';
        } else {
            // 數值越高越好
            if (value >= green) return 'green';
            if (value >= yellow) return 'yellow';
            return 'red';
        }
    }
    
    /**
     * 更新 Layer 2 - Operational Dashboard
     */
    updateLayer2Dashboard(data) {
        if (!data) {
            console.warn('[UI] Layer 2 資料不完整');
            return;
        }
        
        // 更新 Quick Wins
        if (data.quickWins) {
            this.updateQuickWins(data.quickWins);
        }
        
        // 更新風險熱力圖
        if (data.risks) {
            this.updateRiskHeatmap(data.risks);
        }
        
        console.log('[UI] Layer 2 已更新');
    }
    
    /**
     * 更新 Quick Wins 列表
     */
    updateQuickWins(quickWins) {
        const container = document.getElementById('quick-wins-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        quickWins.forEach(item => {
            const div = document.createElement('div');
            div.className = 'quick-win-item';
            div.innerHTML = `
                <div class="icon" style="background: ${this.getIconColor(item.progress)};">
                    ${this.getProgressIcon(item.progress)}
                </div>
                <div class="info">
                    <div class="title">${this.escapeHtml(item.title)}</div>
                    <div class="subtitle">${this.escapeHtml(item.owner)} • ${this.escapeHtml(item.deadline)}</div>
                </div>
                <div class="progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${parseInt(item.progress)}%"></div>
                    </div>
                    <div class="progress-text">${parseInt(item.progress)}% 完成</div>
                </div>
            `;
            container.appendChild(div);
        });
    }
    
    /**
     * 更新風險熱力圖
     */
    updateRiskHeatmap(risks) {
        const cells = {
            'high-high': 0, 'high-med': 0, 'high-low': 0,
            'med-high': 0, 'med-med': 0, 'med-low': 0,
            'low-high': 0, 'low-med': 0, 'low-low': 0
        };
        
        risks.forEach(risk => {
            const key = `${risk.probability}-${risk.impact}`;
            if (cells.hasOwnProperty(key)) {
                cells[key]++;
            }
        });
        
        Object.keys(cells).forEach(key => {
            const element = document.getElementById('risk-' + key);
            if (element) {
                const countElement = element.querySelector('.risk-count');
                if (countElement) {
                    countElement.textContent = cells[key];
                }
            }
        });
    }
    
    /**
     * 更新 Layer 3 - Detailed Analysis
     */
    updateLayer3Details(data) {
        if (!data) {
            console.warn('[UI] Layer 3 資料不完整');
            return;
        }
        
        // 更新專案列表
        if (data.projects) {
            this.updateProjectTable(data.projects);
        }
        
        // 更新資源配置
        if (data.resources) {
            this.updateResourceCards(data.resources);
        }
        
        // 更新關鍵指標
        if (data.metrics) {
            this.updateMetricCards(data.metrics);
        }
        
        console.log('[UI] Layer 3 已更新');
    }
    
    /**
     * 更新專案表格
     */
    updateProjectTable(projects) {
        const tbody = document.querySelector('#project-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        projects.forEach(project => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(project.name)}</td>
                <td>${this.escapeHtml(project.department)}</td>
                <td>
                    <div class="project-status">
                        <span class="status-dot ${this.getStatus(project.progress, this.config.thresholds.progress)}"></span>
                        ${this.escapeHtml(project.status)}
                    </div>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${parseInt(project.progress)}%"></div>
                    </div>
                    <div class="progress-text">${parseInt(project.progress)}%</div>
                </td>
                <td>${this.escapeHtml(project.budget)}</td>
                <td>${this.escapeHtml(project.timeline)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    /**
     * 更新資源卡片
     */
    updateResourceCards(resources) {
        this.updateElement('total-budget', resources.totalBudget || 'N/A');
        this.updateElement('used-budget', resources.usedBudget || 'N/A');
        this.updateElement('total-headcount', resources.totalHeadcount || 'N/A');
        this.updateElement('allocated-headcount', resources.allocatedHeadcount || 'N/A');
    }
    
    /**
     * 更新指標卡片
     */
    updateMetricCards(metrics) {
        this.updateElement('metric-adoption', metrics.adoption || 'N/A');
        this.updateElement('metric-satisfaction', metrics.satisfaction || 'N/A');
        this.updateElement('metric-efficiency', metrics.efficiency || 'N/A');
    }
    
    /**
     * 顯示載入指示器
     */
    showLoading(message = '載入中...') {
        let loader = document.getElementById('loading-indicator');
        
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading-indicator';
            loader.className = 'loading-indicator';
            loader.innerHTML = `
                <div class="spinner">⏳</div>
                <div class="text">${message}</div>
            `;
            document.body.appendChild(loader);
        }
        
        loader.classList.add('show');
        console.log('[UI] 顯示載入指示器');
    }
    
    /**
     * 隱藏載入指示器
     */
    hideLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.classList.remove('show');
        }
        console.log('[UI] 隱藏載入指示器');
    }
    
    /**
     * 顯示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        if (!this.config?.features?.enableNotifications) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${this.getNotificationIcon(type)}</span>
            <span>${this.escapeHtml(message)}</span>
        `;
        
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        console.log(`[UI] 顯示通知: ${message}`);
    }
    
    /**
     * 更新最後刷新時間
     */
    updateLastRefreshTime(timestamp) {
        const element = document.getElementById('last-refresh');
        if (element) {
            const time = timestamp ? new Date(timestamp) : new Date();
            element.textContent = this.formatTime(time);
        }
    }
    
    /**
     * 格式化時間
     */
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    /**
     * 更新元素內容
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
    
    /**
     * 取得趨勢圖示
     */
    getTrendIcon(trend) {
        const icons = {
            up: '📈 +3',
            down: '📉 -2',
            stable: '➡️ 0'
        };
        return icons[trend] || icons.stable;
    }
    
    /**
     * 取得進度圖示
     */
    getProgressIcon(progress) {
        if (progress >= 80) return '✅';
        if (progress >= 50) return '🔄';
        return '⏳';
    }
    
    /**
     * 取得圖示顏色
     */
    getIconColor(progress) {
        if (progress >= 80) return this.config.charts.colors.success;
        if (progress >= 50) return this.config.charts.colors.warning;
        return this.config.charts.colors.danger;
    }
    
    /**
     * 取得通知圖示
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}

console.log('[UI] UI 模組已載入');

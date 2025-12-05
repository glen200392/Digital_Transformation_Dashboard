/**
 * ============================================================
 * 數位轉型儀表板 - 圖表管理模組
 * 版本: 2.0.0
 * 
 * 負責初始化和管理所有 Chart.js 圖表
 * ============================================================
 */

class ChartManager {
    constructor(config = CONFIG.charts) {
        this.config = config;
        this.charts = {};
        
        console.log('[Charts] ChartManager 已初始化');
    }
    
    /**
     * 初始化轉型成熟度雷達圖
     */
    initRadarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`[Charts] 找不到畫布元素: ${canvasId}`);
            return null;
        }
        
        // 銷毀舊圖表
        this.destroyChart(canvasId);
        
        const chartData = {
            labels: data.labels || ['策略規劃', '流程優化', '技術能力', '人才發展', '數據治理', '創新文化'],
            datasets: [{
                label: '當前成熟度',
                data: data.current || [75, 82, 68, 71, 79, 85],
                backgroundColor: this.config.colors.primaryLight,
                borderColor: this.config.colors.primary,
                borderWidth: 2,
                pointBackgroundColor: this.config.colors.primary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: this.config.colors.primary
            }, {
                label: '目標成熟度',
                data: data.target || [85, 90, 85, 85, 90, 90],
                backgroundColor: this.config.colors.secondaryLight,
                borderColor: this.config.colors.secondary,
                borderWidth: 2,
                pointBackgroundColor: this.config.colors.secondary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: this.config.colors.secondary,
                borderDash: [5, 5]
            }]
        };
        
        const options = {
            responsive: this.config.responsive,
            maintainAspectRatio: this.config.maintainAspectRatio,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            family: this.config.fontFamily || "'Segoe UI', sans-serif"
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: this.config.fontFamily || "'Segoe UI', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '%';
                        }
                    }
                }
            }
        };
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: chartData,
            options: options
        });
        
        console.log(`[Charts] 雷達圖已初始化: ${canvasId}`);
        return this.charts[canvasId];
    }
    
    /**
     * 初始化 Quick Win 燃盡圖
     */
    initBurndownChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`[Charts] 找不到畫布元素: ${canvasId}`);
            return null;
        }
        
        this.destroyChart(canvasId);
        
        const chartData = {
            labels: data.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: '理想進度',
                data: data.ideal || [100, 83, 66, 49, 32, 15],
                borderColor: this.config.colors.gray,
                backgroundColor: this.config.colors.grayLight,
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 4,
                tension: 0.1
            }, {
                label: '實際進度',
                data: data.actual || [100, 85, 68, 52, 35, 18],
                borderColor: this.config.colors.success,
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true
            }]
        };
        
        const options = {
            responsive: this.config.responsive,
            maintainAspectRatio: this.config.maintainAspectRatio,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        };
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: options
        });
        
        console.log(`[Charts] 燃盡圖已初始化: ${canvasId}`);
        return this.charts[canvasId];
    }
    
    /**
     * 初始化能力建設漏斗圖
     */
    initFunnelChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`[Charts] 找不到畫布元素: ${canvasId}`);
            return null;
        }
        
        this.destroyChart(canvasId);
        
        const chartData = {
            labels: data.labels || ['認知階段', '學習階段', '實作階段', '精通階段', '教學階段'],
            datasets: [{
                label: '人數',
                data: data.values || [450, 320, 180, 95, 42],
                backgroundColor: [
                    this.config.colors.primary,
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(102, 126, 234, 0.6)',
                    'rgba(102, 126, 234, 0.4)',
                    'rgba(102, 126, 234, 0.2)'
                ],
                borderWidth: 0
            }]
        };
        
        const options = {
            responsive: this.config.responsive,
            maintainAspectRatio: this.config.maintainAspectRatio,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x + ' 人';
                        }
                    }
                }
            }
        };
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: options
        });
        
        console.log(`[Charts] 漏斗圖已初始化: ${canvasId}`);
        return this.charts[canvasId];
    }
    
    /**
     * 初始化技術採用曲線圖
     */
    initAdoptionChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.warn(`[Charts] 找不到畫布元素: ${canvasId}`);
            return null;
        }
        
        this.destroyChart(canvasId);
        
        const chartData = {
            labels: data.labels || ['創新者', '早期採用者', '早期大眾', '晚期大眾', '落後者'],
            datasets: [{
                label: '採用率',
                data: data.values || [2.5, 13.5, 34, 34, 16],
                backgroundColor: [
                    this.config.colors.primary,
                    this.config.colors.success,
                    this.config.colors.warning,
                    'rgba(250, 204, 21, 0.6)',
                    this.config.colors.danger
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };
        
        const options = {
            responsive: this.config.responsive,
            maintainAspectRatio: this.config.maintainAspectRatio,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: this.config.fontFamily
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        };
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: options
        });
        
        console.log(`[Charts] 採用曲線圖已初始化: ${canvasId}`);
        return this.charts[canvasId];
    }
    
    /**
     * 更新圖表資料
     */
    updateChart(canvasId, newData) {
        const chart = this.charts[canvasId];
        
        if (!chart) {
            console.warn(`[Charts] 找不到圖表: ${canvasId}`);
            return;
        }
        
        if (newData.labels) {
            chart.data.labels = newData.labels;
        }
        
        if (newData.datasets) {
            chart.data.datasets = newData.datasets;
        }
        
        chart.update();
        console.log(`[Charts] 圖表已更新: ${canvasId}`);
    }
    
    /**
     * 銷毀圖表
     */
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
            console.log(`[Charts] 圖表已銷毀: ${canvasId}`);
        }
    }
    
    /**
     * 銷毀所有圖表
     */
    destroyAll() {
        Object.keys(this.charts).forEach(canvasId => {
            this.destroyChart(canvasId);
        });
        console.log('[Charts] 所有圖表已銷毀');
    }
    
    /**
     * 取得圖表實例
     */
    getChart(canvasId) {
        return this.charts[canvasId] || null;
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}

console.log('[Charts] Charts 模組已載入');

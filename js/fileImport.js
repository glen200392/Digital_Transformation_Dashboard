/**
 * ============================================================
 * 數位轉型儀表板 - Excel/CSV 檔案導入模組
 * 版本: 1.0.0
 * 
 * 負責處理 Excel 和 CSV 檔案的上傳、解析與驗證
 * 使用 SheetJS (xlsx) 函式庫
 * ============================================================
 */

class FileImport {
    constructor(validator, config = CONFIG.dataImport) {
        this.validator = validator;
        this.config = config;
        this.currentFile = null;
        this.parsedData = null;
        
        console.log('[FileImport] 檔案導入模組已初始化');
    }
    
    /**
     * 檢查檔案類型是否允許
     */
    isFileTypeAllowed(filename) {
        const ext = '.' + filename.split('.').pop().toLowerCase();
        return this.config.allowedFileTypes.includes(ext);
    }
    
    /**
     * 檢查檔案大小是否符合限制
     */
    isFileSizeAllowed(fileSize) {
        return fileSize <= this.config.maxFileSize;
    }
    
    /**
     * 驗證檔案
     */
    validateFile(file) {
        const errors = [];
        
        if (!file) {
            errors.push('未選擇檔案');
            return { valid: false, errors };
        }
        
        if (!this.isFileTypeAllowed(file.name)) {
            errors.push(`不支援的檔案類型。允許的類型: ${this.config.allowedFileTypes.join(', ')}`);
        }
        
        if (!this.isFileSizeAllowed(file.size)) {
            const maxSizeMB = (this.config.maxFileSize / (1024 * 1024)).toFixed(1);
            errors.push(`檔案大小超過限制（最大 ${maxSizeMB}MB）`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * 讀取並解析檔案
     */
    async parseFile(file, dataType) {
        return new Promise((resolve, reject) => {
            const fileValidation = this.validateFile(file);
            if (!fileValidation.valid) {
                reject(new Error(fileValidation.errors.join(', ')));
                return;
            }
            
            this.currentFile = file;
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // 取得第一個工作表
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // 轉換為 JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                        header: 1,
                        defval: '',
                        raw: false
                    });
                    
                    if (jsonData.length === 0) {
                        reject(new Error('檔案沒有資料'));
                        return;
                    }
                    
                    // 解析標題和資料
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1);
                    
                    // 轉換為物件陣列
                    const parsedData = rows
                        .filter(row => row.some(cell => cell !== '')) // 過濾空行
                        .map(row => {
                            const obj = {};
                            headers.forEach((header, index) => {
                                obj[header] = row[index] || '';
                            });
                            return obj;
                        });
                    
                    // 檢查資料筆數限制
                    if (parsedData.length > this.config.maxRowsPerImport) {
                        reject(new Error(`資料筆數超過限制（最大 ${this.config.maxRowsPerImport} 筆）`));
                        return;
                    }
                    
                    this.parsedData = {
                        type: dataType,
                        headers,
                        data: parsedData,
                        rowCount: parsedData.length,
                        fileName: file.name,
                        fileSize: file.size
                    };
                    
                    console.log('[FileImport] 檔案解析成功:', this.parsedData);
                    resolve(this.parsedData);
                    
                } catch (error) {
                    console.error('[FileImport] 檔案解析失敗:', error);
                    reject(new Error(`檔案解析失敗: ${error.message}`));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('檔案讀取失敗'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * 驗證解析後的資料
     */
    validateParsedData(parsedData) {
        if (!parsedData || !parsedData.data) {
            return {
                valid: false,
                errors: ['沒有資料可驗證'],
                summary: null
            };
        }
        
        // 使用 InputValidator 驗證每一筆資料
        const validationResult = this.validator.validateBatch(parsedData.data, parsedData.type);
        
        return {
            valid: validationResult.invalid === 0,
            summary: validationResult,
            errors: validationResult.invalid > 0 ? 
                [`發現 ${validationResult.invalid} 筆資料有錯誤`] : []
        };
    }
    
    /**
     * 生成資料預覽表格 HTML
     */
    generatePreviewTable(parsedData, validationResult, maxRows = 10) {
        if (!parsedData || !parsedData.data) {
            return '<p class="text-muted">無資料可預覽</p>';
        }
        
        const { headers, data } = parsedData;
        const displayData = data.slice(0, maxRows);
        
        let html = '<div class="table-responsive">';
        html += '<table class="preview-table">';
        
        // 表頭
        html += '<thead><tr>';
        html += '<th class="row-number">#</th>';
        html += '<th class="validation-status">狀態</th>';
        headers.forEach(header => {
            html += `<th>${this.escapeHtml(header)}</th>`;
        });
        html += '</tr></thead>';
        
        // 資料列
        html += '<tbody>';
        displayData.forEach((row, index) => {
            const validation = validationResult?.summary?.results[index];
            const hasError = validation && !validation.valid;
            const hasWarning = validation && validation.warnings.length > 0;
            
            let statusClass = hasError ? 'error' : (hasWarning ? 'warning' : 'success');
            let statusIcon = hasError ? '❌' : (hasWarning ? '⚠️' : '✅');
            let statusTitle = '';
            
            if (hasError) {
                statusTitle = validation.errors.join(', ');
            } else if (hasWarning) {
                statusTitle = validation.warnings.join(', ');
            }
            
            html += `<tr class="${hasError ? 'row-error' : (hasWarning ? 'row-warning' : '')}">`;
            html += `<td class="row-number">${index + 1}</td>`;
            html += `<td class="validation-status ${statusClass}" title="${this.escapeHtml(statusTitle)}">${statusIcon}</td>`;
            
            headers.forEach(header => {
                const value = row[header] || '';
                html += `<td>${this.escapeHtml(String(value))}</td>`;
            });
            
            html += '</tr>';
        });
        html += '</tbody>';
        
        html += '</table>';
        
        if (data.length > maxRows) {
            html += `<p class="text-muted">顯示前 ${maxRows} 筆，共 ${data.length} 筆資料</p>`;
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * 生成驗證結果摘要 HTML
     */
    generateValidationSummary(validationResult) {
        if (!validationResult || !validationResult.summary) {
            return '';
        }
        
        const { total, valid, invalid, withWarnings } = validationResult.summary;
        
        let html = '<div class="validation-summary">';
        
        // 總覽
        html += '<div class="summary-stats">';
        html += `<div class="stat"><span class="label">總筆數:</span> <span class="value">${total}</span></div>`;
        html += `<div class="stat success"><span class="label">有效:</span> <span class="value">${valid}</span></div>`;
        
        if (invalid > 0) {
            html += `<div class="stat error"><span class="label">錯誤:</span> <span class="value">${invalid}</span></div>`;
        }
        
        if (withWarnings > 0) {
            html += `<div class="stat warning"><span class="label">警告:</span> <span class="value">${withWarnings}</span></div>`;
        }
        
        html += '</div>';
        
        // 錯誤詳情
        if (invalid > 0) {
            html += '<div class="error-details">';
            html += '<h4>❌ 錯誤詳情:</h4>';
            html += '<ul>';
            
            validationResult.summary.results.forEach((result, index) => {
                if (!result.valid) {
                    html += `<li><strong>第 ${index + 1} 筆:</strong> ${result.errors.join(', ')}</li>`;
                }
            });
            
            html += '</ul>';
            html += '</div>';
        }
        
        // 警告詳情
        if (withWarnings > 0) {
            html += '<div class="warning-details">';
            html += '<h4>⚠️ 警告詳情:</h4>';
            html += '<ul>';
            
            validationResult.summary.results.forEach((result, index) => {
                if (result.warnings.length > 0) {
                    html += `<li><strong>第 ${index + 1} 筆:</strong> ${result.warnings.join(', ')}</li>`;
                }
            });
            
            html += '</ul>';
            html += '</div>';
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * 清理已解析的資料
     */
    clearParsedData() {
        this.currentFile = null;
        this.parsedData = null;
        console.log('[FileImport] 已清除解析資料');
    }
    
    /**
     * HTML 轉義（防止 XSS）
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 下載範本檔案
     */
    downloadTemplate(type) {
        const templates = {
            projects: {
                headers: ['name', 'department', 'status', 'progress', 'budget', 'startDate', 'endDate', 'owner', 'description'],
                sample: [
                    ['數位行銷平台', '行銷部', 'in_progress', '65', '500000', '2024-01-01', '2024-12-31', '張三', '建立整合性數位行銷平台']
                ]
            },
            risks: {
                headers: ['title', 'category', 'probability', 'impact', 'status', 'owner', 'mitigation', 'description'],
                sample: [
                    ['技術人才不足', 'resource', 'high', 'high', 'open', '李四', '啟動人才培訓計畫', '缺乏關鍵技術人才']
                ]
            },
            quickwins: {
                headers: ['title', 'owner', 'status', 'estimatedHours', 'dueDate', 'description'],
                sample: [
                    ['優化報表產出流程', '王五', 'in_progress', '40', '2024-12-31', '自動化月報產出']
                ]
            },
            kpi: {
                headers: ['metric', 'value', 'target', 'unit', 'category'],
                sample: [
                    ['數位轉型成熟度', '76', '85', '分', 'overall']
                ]
            }
        };
        
        const template = templates[type];
        if (!template) {
            console.error('[FileImport] 未知的範本類型:', type);
            return;
        }
        
        // 建立工作表
        const ws = XLSX.utils.aoa_to_sheet([template.headers, ...template.sample]);
        
        // 建立工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, type);
        
        // 下載檔案
        const filename = `${type}_template_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        console.log('[FileImport] 已下載範本:', filename);
    }
}

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileImport;
}

console.log('[FileImport] 檔案導入模組已載入');

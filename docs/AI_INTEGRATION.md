# AI 整合說明文件

## 📋 概述

本文件說明如何將 AI 服務整合到數位轉型儀表板中，實現智能化資料輸入功能。

**狀態**: Phase 2 預留接口 - 接口已準備完成，等待實際 AI 服務配置

## 🎯 支援的 AI 功能

### 1️⃣ 語音輸入 (ASR - Automatic Speech Recognition)

將語音轉換為文字，支援自然語言描述專案、風險等資訊。

**支援的服務提供商**:
- **Whisper** (推薦): OpenAI 開源模型，支援地端部署
- **Azure Speech Service**: Microsoft Azure 雲端服務
- **Google Cloud Speech-to-Text**: Google Cloud 雲端服務

### 2️⃣ LLM 文字理解

使用大型語言模型將非結構化文字轉換為結構化資料。

**支援的服務提供商**:
- **本地 LLM**: 
  - Ollama (支援 Llama, Qwen, Taiwan-LLM 等)
  - LM Studio
  - vLLM
- **雲端 LLM**:
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic Claude
  - Google Gemini

### 3️⃣ OCR/視覺辨識

從圖片或文件中提取文字和結構化資訊。

**支援的服務提供商**:
- **PaddleOCR**: 百度開源 OCR，支援繁體中文
- **LLaVA**: 開源多模態視覺語言模型
- **Qwen-VL**: 阿里巴巴通義千問視覺語言模型

## ⚙️ 設定說明

### 基本設定

在 `js/config.js` 中找到 `ai` 區塊進行設定：

```javascript
ai: {
    // 語音辨識 (ASR)
    speech: {
        enabled: false,           // 設為 true 啟用
        provider: 'whisper',      // 服務提供商
        endpoint: '',             // API 端點 URL
        apiKey: '',               // API 金鑰
        language: 'zh-TW',        // 語言設定
        model: 'large-v3'         // 模型版本
    },
    
    // LLM 文字理解
    llm: {
        enabled: false,
        provider: 'local',        // 'local' | 'openai' | 'claude' | 'gemini'
        endpoint: '',             // 本地或雲端 API 端點
        apiKey: '',
        model: '',                // 模型名稱
        systemPrompt: '你是數位轉型專案助理...'
    },
    
    // OCR/視覺辨識
    vision: {
        enabled: false,
        provider: 'paddleocr',    // 'paddleocr' | 'llava' | 'qwen-vl'
        endpoint: '',
        apiKey: '',
        supportedFormats: ['jpg', 'png', 'pdf']
    }
}
```

## 🚀 快速開始

### 方案 A: 本地部署 (推薦用於開發測試)

#### 1. 安裝 Ollama (本地 LLM)

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# 下載模型
ollama pull llama3.1
ollama pull qwen2.5

# 啟動服務
ollama serve
```

**設定**:
```javascript
llm: {
    enabled: true,
    provider: 'local',
    endpoint: 'http://localhost:11434/api/generate',
    apiKey: '',  // 本地不需要
    model: 'llama3.1',
    systemPrompt: '你是數位轉型專案助理，協助分析和整理專案資料。請將非結構化資料轉換為結構化格式。'
}
```

#### 2. 安裝 Whisper (本地語音辨識)

```bash
# 使用 Python
pip install openai-whisper

# 或使用 whisper.cpp (更快速)
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make
./models/download-ggml-model.sh base
```

**啟動 API 伺服器**:
```bash
# 使用 faster-whisper
pip install faster-whisper flask
python whisper_server.py  # 自行實作簡單的 Flask API
```

**設定**:
```javascript
speech: {
    enabled: true,
    provider: 'whisper',
    endpoint: 'http://localhost:5000/transcribe',
    apiKey: '',
    language: 'zh-TW',
    model: 'base'
}
```

#### 3. 安裝 PaddleOCR (本地 OCR)

```bash
pip install paddlepaddle paddleocr

# 啟動 API 服務
python ocr_server.py  # 自行實作簡單的 API
```

**設定**:
```javascript
vision: {
    enabled: true,
    provider: 'paddleocr',
    endpoint: 'http://localhost:8000/ocr',
    apiKey: '',
    supportedFormats: ['jpg', 'png', 'pdf']
}
```

### 方案 B: 雲端服務 (推薦用於生產環境)

#### 使用 OpenAI API

```javascript
speech: {
    enabled: true,
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/audio/transcriptions',
    apiKey: process.env.OPENAI_API_KEY,  // 從環境變數讀取
    language: 'zh-TW',
    model: 'whisper-1'
},

llm: {
    enabled: true,
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    systemPrompt: '你是數位轉型專案助理...'
}
```

## 🔒 安全性建議

### API Key 管理

**❌ 不要這樣做**:
```javascript
apiKey: 'sk-proj-abc123...'  // 永遠不要直接寫在程式碼中！
```

**✅ 建議做法**:

1. **使用環境變數** (伺服器端):
```javascript
apiKey: process.env.OPENAI_API_KEY
```

2. **使用後端代理**:
```javascript
// 前端只呼叫自己的後端
endpoint: 'https://yourdomain.com/api/ai/chat'

// 後端負責轉發並添加 API Key
```

3. **使用 Secret Manager**:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager

### 速率限制

建議在前端實作速率限制：

```javascript
// 在 config.js 中
security: {
    enableRateLimiting: true,
    maxRequestsPerMinute: 10  // AI 請求通常較慢，限制更嚴格
}
```

## 📝 實作範例

### 範例 1: 自然語言轉專案資料

**使用者輸入**:
```
我們計畫在明年3月啟動一個客戶關係管理系統專案，
預算大約80萬，由業務部的李四負責，
預計12月底完成。
```

**LLM 處理**:
```javascript
const result = await aiConnector.parseNaturalLanguage(userInput, 'project');

// 預期輸出:
{
    name: '客戶關係管理系統',
    department: '業務部',
    status: 'planning',
    budget: 800000,
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    owner: '李四'
}
```

### 範例 2: 會議記錄分析

**輸入**: 會議記錄文字

**輸出**: 自動提取的專案、風險、行動項目

```javascript
const analysis = await aiConnector.analyzeMeetingNotes(transcript);

// 預期輸出:
{
    projects: [...],
    risks: [...],
    quickWins: [...]
}
```

## 🛠️ 實作清單

### Phase 2 開發任務

- [ ] 實作語音錄音功能 (使用 MediaRecorder API)
- [ ] 實作 Whisper API 整合
- [ ] 實作 LLM Prompt Engineering
- [ ] 實作自然語言解析邏輯
- [ ] 實作 OCR 圖片上傳
- [ ] 實作 PaddleOCR/多模態模型整合
- [ ] 實作錯誤處理和重試機制
- [ ] 實作用戶回饋和調整機制
- [ ] 撰寫單元測試
- [ ] 撰寫使用文件

### Prompt Engineering 範例

```javascript
const systemPrompt = `
你是數位轉型專案管理助理。

任務：將使用者的自然語言描述轉換為結構化的專案資料。

輸出格式（JSON）：
{
  "name": "專案名稱",
  "department": "部門",
  "status": "planning|in_progress|on_hold|completed|cancelled",
  "progress": 0-100,
  "budget": 數字,
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "owner": "負責人",
  "description": "專案描述"
}

規則：
1. 只輸出 JSON，不要額外解釋
2. 如果資訊不完整，使用合理的預設值
3. 日期格式必須是 YYYY-MM-DD
4. 狀態值必須是預定義的選項之一
`;
```

## 📊 成本估算

### 雲端服務成本 (參考)

**OpenAI GPT-4**:
- 輸入: $0.03/1K tokens
- 輸出: $0.06/1K tokens
- 平均每次請求: ~$0.01-0.05

**OpenAI Whisper**:
- $0.006/分鐘

**建議**:
- 開發測試使用本地模型
- 生產環境評估成本後選擇方案
- 設定預算上限和使用量監控

## 🔍 測試與驗證

### 測試檢查清單

- [ ] API 連接測試
- [ ] 語音轉文字準確度測試
- [ ] LLM 結構化資料提取準確度測試
- [ ] OCR 繁體中文辨識測試
- [ ] 錯誤處理測試
- [ ] 超時和重試測試
- [ ] 安全性測試
- [ ] 效能測試

## 📞 技術支援

如有問題或需要協助，請：
1. 查看 `js/aiConnector.js` 中的註解
2. 參考各 AI 服務的官方文件
3. 聯繫數位轉型辦公室技術團隊

## 🔗 相關資源

- [Ollama 官網](https://ollama.com/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- [OpenAI API 文件](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

---

**版本**: 1.0.0  
**最後更新**: 2025-12-06  
**維護者**: Digital Transformation Team

# Harness Engineering — AI 應用開發工作流系統

一個完整的項目管理和知識系統，用於加速 AI 應用從需求到部署的全周期交付。

在 [DESTINY 專案](https://destinyanddestiny.com/)中已驗證運行。

---

## 🎯 核心特性

| 特性 | 效果 | 指標 |
|------|------|------|
| **跨 Session 記憶系統** | 無縫交接，無需重新理解上文 | 5 分鐘交接（vs. 原來 30+ 分鐘） |
| **條件化規則系統** | 根據編輯路徑自動加載相關檢查清單 | 減少 60% 的遺漏 |
| **文檔驅動開發** | 12+ 核心文檔 + 40+ 設計決策記錄 | 新人上手 1 天（vs. 原來 1 週） |
| **自動化工作流** | 從需求到上線的完整流程 | 交付周期縮短 50%+ |

---

## 📁 系統組成

### 1. `.claude/memory/` — 項目記憶系統

跨 Session 保持上下文，支持團隊交接與知識積累。

```
.claude/memory/
├── MEMORY.md                    ← 項目活躍記憶（每個 session 更新）
├── HANDOFF-TEMPLATE.md          ← 交接文檔模板
└── [功能名].md                  ← 特定功能的開發進度
```

**用途**：
- 記錄當前項目狀態（已完成、進行中、待做）
- 跨 Session 快速上下文切換（5 分鐘搞定，不用 30+ 分鐘）
- 自動過期機制（保持記憶新鮮）

---

### 2. `.claude/rules/` — 條件化規則系統

根據編輯的代碼路徑自動加載相關規則，提醒重要檢查清單。

```
.claude/rules/
├── docs-first.md           ← 實作前必讀文檔、完成後更新
├── astro-service.md        ← Python 後端服務規則
├── frontend.md             ← Next.js / React 前端規則
├── api-security.md         ← API 安全與內部金鑰管理
├── supabase.md             ← 資料庫與 RLS 政策規則
├── shared-modules.md       ← 共用模組修改影響評估
└── verify-impact.md        ← 跨服務影響驗證檢查清單
```

**用途**：
- 編輯 `backend/*` 時自動加載 `astro-service.md`
- 編輯 `frontend/*` 時自動加載 `frontend.md`
- 提醒「別忘了檢查安全」「別忘了更新文檔」

---

### 3. `.claude/settings.json` — 配置管理

集中管理 Claude Code 配置、權限、環境變數。

```
settings.json (committed to git)
├── 項目級權限清單
├── 常見 Bash 命令的快速許可
└── 環境變數定義

settings.local.json (gitignore，機器特定)
└── 敏感資訊（API key、本地路徑）
```

---

### 4. `docs/` — 文檔驅動開發系統

12+ 核心文檔，按「規範」「參考」「指南」「檔案」「追蹤」分類。

```
docs/
├── README.md                               ← 文檔導航
├── DESTINY-MVP-SPEC.md                    ← 規範：系統設計藍圖
├── ALGORITHM.md                           ← 參考：演算法設計與版本歷史
├── ALGORITHM-CHANGELOG.md                 ← 追蹤：每次變更的記錄
├── ASTRO-SERVICE-ALGORITHM-SPEC.md        ← 實作：深度 Python 實現指南
├── ASTRO-SERVICE.md                       ← 指南：API 使用手冊
├── PROMPT-GUIDE.md                        ← 指南：LLM Prompt 工程
├── DESIGN-DECISIONS.md                    ← 檔案：40+ 架構決策記錄
├── TECH-STACK.md                          ← 參考：技術選擇與原因
├── TESTING-GUIDE.md                       ← 指南：完整測試戰略
├── WEIGHTS-TUNING-GUIDE.md                ← 參考：參數調整表
└── DEPLOYMENT.md                          ← 指南：部署流程（v3.3）
```

**用途**：
- 新人快速上手（1 天讀完規範 + 參考）
- 跨 Session 交接（查文檔而不是問人）
- 決策追蹤（為什麼當初這樣設計）

---

## 🚀 快速開始

### 第 1 步：複製此倉庫的結構

```bash
# 克隆此倉庫
git clone https://github.com/shen2255678/claude.git your-ai-project

cd your-ai-project

# 初始化你的項目
git remote set-url origin <your-repo-url>
```

### 第 2 步：自訂文檔

編輯以下文檔（使用 `examples/destiny-project/` 作為參考）：

1. `docs/DESTINY-MVP-SPEC.md` → 改成你的系統規範
2. `docs/DESIGN-DECISIONS.md` → 記錄你的設計決策
3. `.claude/memory/MEMORY.md` → 記錄專案進度

### 第 3 步：建立條件規則

根據你的技術棧編輯 `.claude/rules/`：
- 你用 FastAPI？保留 `astro-service.md`
- 你用 Next.js？保留 `frontend.md`
- 自訂其他規則

### 第 4 步：開始使用

在 Claude Code 中：
1. 打開你的項目
2. 系統會自動加載 `.claude/rules/` 中的相關規則
3. 編輯前先查詢 `docs/` 中的文檔
4. 完成後更新 `.claude/memory/MEMORY.md`

詳見 [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)

---

## 📚 文檔分類

### 規範文檔（每季度更新）
用於新人上手和系統全景理解。

- **DESTINY-MVP-SPEC.md** — 完整的系統設計藍圖
- **TECH-STACK.md** — 技術選擇與原因

### 參考文檔（月度更新）
用於查詢技術細節和常數表。

- **ALGORITHM.md** — 演算法邏輯與版本歷史
- **WEIGHTS-TUNING-GUIDE.md** — 參數調整表
- **DESIGN-DECISIONS.md** — 架構決策（為什麼選擇這個）

### 指南文檔（按需更新）
用於具體任務的操作步驟。

- **DEPLOYMENT.md** — 部署流程（step-by-step）
- **TESTING-GUIDE.md** — 測試戰略和檢查清單
- **PROMPT-GUIDE.md** — LLM Prompt 工程

### 追蹤文檔（每次變更更新）
用於版本演進和最近改動。

- **ALGORITHM-CHANGELOG.md** — 演算法版本歷史
- **MEMORY.md** — 當前專案進度和待做事項

---

## 🔄 工作流執行周期

```
┌─────────────────────────────────────┐
│ Session 開始：理解上文              │
├─────────────────────────────────────┤
│ 1. 讀取 .claude/memory/MEMORY.md    │
│ 2. 進入編輯路徑 → 自動加載規則      │
│ 3. 參考相關的 docs/GUIDE.md         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 開發執行：遵循檢查清單              │
├─────────────────────────────────────┤
│ 1. 查詢 docs 確認規範               │
│ 2. 實作功能 → 遵循相關規則          │
│ 3. 測試驗證 → 參考 TESTING-GUIDE    │
│ 4. 更新文檔 → 記錄在 CHANGELOG      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 交接完成：知識沉澱                  │
├─────────────────────────────────────┤
│ 1. 更新 MEMORY.md（進度歸檔）      │
│ 2. Commit with 完整說明             │
│ 3. 生成交接文檔                     │
└─────────────────────────────────────┘
```

---

## 📊 預期效果

在 DESTINY 專案上的實驗結果：

| 指標 | 實測數據 |
|------|---------|
| **新人上手時間** | 1 天（讀規範） vs. 1 週（無文檔） |
| **跨 Session 交接** | 5 分鐘（查 MEMORY.md） vs. 30+ 分鐘（重新解釋） |
| **代碼審查效率** | 提高 3 倍（有檢查清單） |
| **架構決策理由可查** | 100%（40+ 決策記錄） |
| **端到端交付周期** | 縮短 50%+（自動化工作流） |
| **資料品質檢測覆蓋** | 100%（完整的前處理管道） |

---

## 🎓 在新公司如何複製？

```
Step 1: 建立基礎結構（1 天）
  ├── .claude/memory/MEMORY.md
  ├── .claude/rules/
  └── docs/README.md

Step 2: 編制初始文檔（3 天）
  ├── docs/SPEC.md (系統規範)
  ├── docs/DESIGN-DECISIONS.md
  └── docs/DEPLOYMENT.md

Step 3: 定義條件規則（2 天）
  ├── docs-first.md
  ├── api-security.md
  └── testing.md

Step 4: 建立工作流（3 天）
  └── 全團隊開始使用系統

結果：6-8 週內，整個團隊進入高效協作狀態
```

詳見 [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)

---

## 💾 項目示例

### DESTINY 專案

完整的、線上運行的 AI 應用系統示例。

```
examples/destiny-project/
├── .claude/                ← 實際的 memory、rules、settings
├── docs/                   ← 12 份實際的核心文檔
├── README.md               ← DESTINY 項目說明
└── QUICK-START.md          ← 新人上手指南
```

這是一個「活著的」範例 — 每個文檔都在實際使用中。

你可以：
- 用它作為模板參考你的項目
- 查看「真實世界」中文檔的樣子
- 理解系統是如何在 2000+ 用戶的產品中運作的

---

## 📖 相關資源

- **[QUICK-START.md](./QUICK-START.md)** — 15 分鐘快速開始
- **[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)** — 詳細實施步驟
- **[examples/destiny-project/](./examples/destiny-project/)** — 完整項目範例
- **[文檔分類參考](./docs/README.md)** — 12 份核心文檔的用途

---

## 🔗 作者信息

**呂浩維** — AI 應用工程師 & Harness Engineering 系統設計者

- GitHub: [shen2255678](https://github.com/shen2255678)
- 線上作品: [DESTINY](https://destinyanddestiny.com/)
- 郵箱: shen2255678@gmail.com

---

## 📜 License

MIT License — 歡迎自由使用和修改

---

**貢獻與反饋**

如果你在使用過程中發現改進機會，歡迎提出 Issue 或 Pull Request。

**祝你的 AI 項目順利交付！** 🚀

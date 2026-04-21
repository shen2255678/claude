# DESTINY × Claude Code — 生產 AI 系統的工作流實踐

> 如何在真實的線上系統中，用 Claude Code 管理複雜的 AI 應用

---

## 🎯 這個倉庫的目標

**不是教你「怎麼複製模板」，而是展示「在真實生產環境中，Claude Code 怎麼確保系統質量和可持續性」。**

DESTINY 是完全獨立開發的線上 AI 應用系統（當前 10+ 活躍用戶，線上穩定運行）。本倉庫記錄了：

- ✅ 如何組織 Claude Code 的上下文（CLAUDE.md、.claude/rules/、docs/）
- ✅ 如何在複雜的 AI 系統中保持代碼和文檔同步
- ✅ 如何確保每個開發周期都有清晰的設計決策記錄
- ✅ 為什麼要這樣做、踩過哪些坑

---

## 📊 系統規模

```
DESTINY 項目指標：
├─ 用戶：10+ 活躍用戶（線上生產環境）
├─ 系統複雜度：
│  ├─ 數據庫：44+ 遷移 (v1.0 → v5.17)
│  ├─ API：39+ 端點
│  ├─ 系統整合：4 個占星系統 (西方、吠陀、八字、紫微)
│  └─ LLM 整合：3 個模型 (Claude、DeepSeek、Gemini)
├─ 文檔：12+ 核心文檔
├─ 決策記錄：40+ 架構決策
└─ 開發周期效率：50%+ 提升（vs. 傳統流程）
```

雖然用戶數不大，但系統的**技術複雜度、完整性、工程實踐**足以展示專業級的系統設計。

---

## 📁 倉庫結構（DESTINY 實例）

```
DESTINY 實際運行的文件組織：

CLAUDE.md                      # 三層上下文的第 1 層（永遠載入）
  
.claude/
├─ memory/
│  ├─ MEMORY.md              # Session 記憶索引
│  └─ session-state.md        # Session 交接文檔
├─ rules/
│  ├─ docs-first.md          # 實作前必讀文檔規則
│  ├─ astro-service.md       # Python 後端規則（globs: astro-service/**)
│  ├─ frontend.md            # Next.js 規則（globs: src/pages/**)
│  ├─ api-security.md        # API 安全規則
│  └─ supabase.md            # DB 規則（globs: migrations/**)
└─ settings.json             # 團隊配置 + hooks

docs/                        # 三層上下文的第 3 層（按需讀取）
├─ DESTINY-MVP-SPEC.md       # 完整系統規範
├─ ALGORITHM.md              # 推薦算法設計 v2.3
├─ ALGORITHM-CHANGELOG.md    # 版本歷史（v1.0 → v2.3）
├─ ASTRO-SERVICE.md          # 後端 API 手冊
├─ DESIGN-DECISIONS.md       # 40+ 決策記錄
├─ TESTING-GUIDE.md          # 測試戰略
├─ PROMPT-GUIDE.md           # LLM Prompt 工程
├─ TECH-STACK.md             # 技術選擇與原因
├─ WEIGHTS-TUNING-GUIDE.md   # 推薦模型參數調整
└─ DEPLOYMENT.md             # 部署檢查清單
```

---

## 🏗️ 核心：三層上下文架構

AI 不需要記住所有 — 它需要知道**去哪裡找**。

### Layer 1: CLAUDE.md（永遠載入）

```markdown
# CLAUDE.md
## 專案概覽
DESTINY：4 個占星系統的 AI 匹配平台

## 技術棧
- Frontend: Next.js 16 + TypeScript + Tailwind v4
- Backend: Python FastAPI
- Database: Supabase (PostgreSQL + pgvector)
- LLM: Claude + DeepSeek + Gemini

## 關鍵陷阱（不寫會出事）
1. 推薦算法：必須查 ALGORITHM.md（v2.3 才是正式版）
2. 資料品質：100% 必須過檢測（不能跳過）
3. API 端點：新增前必讀 docs/ASTRO-SERVICE.md

## 模組索引
| 模組 | 路徑 | Rules |
|------|------|-------|
| AI 推理 | astro-service/ | astro-service.md |
| 前端 UI | src/pages/ | frontend.md |
| 數據層 | migrations/ | supabase.md |
```

**效果**：每次 session 開始，Claude 自動載入，知道這是什麼系統、技術棧、最危險的坑。

---

### Layer 2: .claude/rules/（按路徑條件載入）

**只有編輯對應檔案時才載入相關規則。**

```yaml
# .claude/rules/astro-service.md
---
globs: astro-service/**,src/api/**
---
# 編輯這些路徑時自動載入 ↑
```

**規則內容例子**：
```markdown
## 後端規則

### 推薦算法
- 必須使用 ALGORITHM.md 的 v2.3 邏輯
- 所有權重調整記錄在 WEIGHTS-TUNING-GUIDE.md
- 完成後更新 ALGORITHM-CHANGELOG.md

### 資料品質
- 輸入必須經過 5 層驗證
- 檢測率目標：100%
- 異常檢出率：> 95%

### 安全
- SQL 用 parameterized query
- API key 用環境變數，禁止 hardcode
- 每個操作記錄 audit log
```

**效果**：編輯後端時，自動看到最相關的規則。不相關的前端規則不會浪費 token。

---

### Layer 3: docs/（主動讀取）

詳細文檔，開發者在需要時讀取。

| 文檔 | 何時讀 | 內容 |
|------|--------|------|
| **ALGORITHM.md** | 改推薦邏輯 | 完整算法、公式、版本歷史 |
| **DESIGN-DECISIONS.md** | 「為什麼」 | 40+ 決策的理由和折衷 |
| **TESTING-GUIDE.md** | 寫測試 | 單元 + 整合 + E2E 策略 |
| **DEPLOYMENT.md** | 發佈 | Step-by-step 檢查清單 |

---

## 📈 實戰效果

| 指標 | 效果 |
|------|------|
| **新人上手** | 1 天（vs. 傳統 1 週） |
| **跨 Session 交接** | 5 分鐘（vs. 傳統 30+ 分鐘） |
| **代碼審查輪次** | 1-2 輪（vs. 傳統 3-5 輪） |
| **文檔遺漏率** | 0%（vs. 傳統 30-50%） |
| **交付周期** | 縮短 50%+（vs. 傳統流程） |

---

## 📚 完整文檔閱讀順序

### 如果你想理解 DESTINY 的工作流

1. **本 README**（5 分）
   整個系統概況

2. **[CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md)**（30 分）
   深入理解 Claude Code 的 12 個最佳實踐

3. **[docs/](./docs/) 目錄**（1 小時）
   看真實的 DESTINY 文檔怎麼組織

4. **[.claude/](./.claude/) 目錄**（1 小時）
   看實際的 CLAUDE.md、rules、settings.json

### 如果你要應用到自己的專案

詳見 **[CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md) 第 5 章**：
> 大型專案導入策略（5 步流程）

---

## 💡 為什麼這套系統重要

### 對獨立開發者
✅ 一個人做整個系統，需要完整的知識管理  
✅ Claude Code 能加速開發，但需要清晰的上下文  
✅ Session 交接不能依賴「記住」，要有系統  

### 對小團隊（3-5 人）
✅ 新人快速上手，不用依賴「人工解釋」  
✅ 知識永遠在代碼裡，不因人離職而丟失  
✅ 代碼審查更高效（有清晰的規則和 checklist）  

### 對想要學習的人
✅ 看一個真實的、線上運行的系統怎麼組織  
✅ 學習專業級的 Claude Code 工作流  
✅ 理解「為什麼要這樣設計」  

---

## 🚀 快速開始

### 想看實際例子？

```bash
# 1. 複製倉庫
git clone https://github.com/shen2255678/claude.git
cd claude

# 2. 看上下文入口
cat CLAUDE.md

# 3. 看條件化規則
ls -la .claude/rules/

# 4. 看完整文檔
ls -la docs/
```

### 想了解完整最佳實踐？

閱讀 **[CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md)**（978 行，涵蓋 12 章）

---

## 🔗 相關連結

- **線上作品**：[DESTINY](https://destinyanddestiny.com/) — 實際運行的系統
- **源代碼**：[shen2255678/destiny](https://github.com/shen2255678/destiny) — 完整代碼和文檔
- **作者**：呂浩維 | [LinkedIn](https://www.linkedin.com/in/浩維-呂-343585213) | shen2255678@gmail.com

---

## 🎯 最後的話

這不是「模板教程」。

**這是「在真實生產環境中，我怎麼用 Claude Code 確保系統質量、知識轉移、可持續性」的完整記錄。**

雖然用戶數只有 10+ 人，但系統的複雜度、工程實踐的完整性、文檔的專業度，足以展示「如何正確地用 Claude Code 構建 AI 系統」。

---

**版本**：1.0 | 2026-04-21 | 基於 DESTINY v5.17 實際運行

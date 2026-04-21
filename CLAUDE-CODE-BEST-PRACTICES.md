# Claude Code 團隊最佳實踐指南

> 版本：1.0 | 2026-03-30
> 適用：Claude Code CLI / Desktop / Web (claude.ai/code)
> 目標讀者：技術主管、團隊 lead、獨立開發者

---

## 目錄

1. [三層上下文架構](#1-三層上下文架構)
2. [Token 成本控管](#2-token-成本控管)
3. [對話工作流程](#3-對話工作流程)
4. [Spec 驅動開發與文件管理](#4-spec-驅動開發與文件管理)
5. [大型專案導入策略](#5-大型專案導入策略legacy-infra-翻新)
6. [資料庫知識注入](#6-資料庫知識注入)
7. [團隊規範制定](#7-團隊規範制定)
8. [Auto Memory 管理](#8-auto-memory-管理)
9. [Hooks 強制機制](#9-hooks-強制機制)
10. [Git 工作流](#10-git-工作流)
11. [Skills 操作與團隊整合](#11-skills-操作與團隊整合)
12. [安全與合規](#12-安全與合規)

---

## 1. 三層上下文架構

AI 不需要記住所有——它需要知道**去哪裡找**。

```
Layer 1: CLAUDE.md（<200 行）
│  永遠載入 → 放「不知道會出事」的陷阱 + 行為規則 + 指標
│
Layer 2: .claude/rules/（按路徑條件載入）
│  編輯匹配檔案時才載入 → 放模組級規則
│  支援 globs frontmatter 精準觸發
│
Layer 3: docs/（主動 Read 時才消耗 token）
   深度參考 → 算法 spec、欄位表、架構圖、DB schema
```

### 各層該放什麼

| 層級 | 內容 | 範例 |
|------|------|------|
| **CLAUDE.md** | 專案概覽、技術棧、關鍵陷阱、行為規則、文件指標 | _COMPAT 白名單警告、預設語言、dev commands |
| **rules/** | 模組特定規則、API 端點表、DB schema、安全規則 | `astro-service.md`（globs: astro-service/**） |
| **docs/** | 完整規格、設計文件、changelog、權重指南 | `DESTINY-MVP-SPEC.md`、`ALGORITHM.md` |

### Rules 的 globs 語法

```markdown
---
globs: src/api/**,src/middleware/**
---
# API 開發規則
只有編輯 src/api/ 或 src/middleware/ 下的檔案時才載入。
```

**多路徑用逗號分隔**，支援 `**` glob。

### 全域 vs 專案 rules

| | `~/.claude/rules/` | `.claude/rules/` |
|---|---|---|
| 範圍 | 所有專案 | 當前專案 |
| 條件載入 | **不支援** globs（全部載入） | **支援** globs |
| Git | 不進 repo | 可進 repo（團隊共享） |
| 適合放 | 精簡的跨專案通用準則（<150 行） | 模組級專案規則 |

> **陷阱**：`~/.claude/rules/` 的所有 `.md` 都會無條件載入到每個專案。放 500 行 TypeScript rules 在這裡，做 Python 專案時也會吃 token。

---

## 2. Token 成本控管

### 「始終載入」vs「按需載入」成本構成

每次 session 啟動，以下內容**無條件消耗 token**：

| 來源 | 大小 | 可控？ |
|------|------|--------|
| System prompt（Claude 內建） | ~2,000 tokens | 不可 |
| CLAUDE.md | 可控 | **控制在 <200 行** |
| `~/.claude/rules/*` | 可控 | **精簡，不放模組規則** |
| Auto Memory (`MEMORY.md`) | 可控 | **<200 行** |
| Skills 列表（已安裝） | 與數量成正比 | 適度安裝 |

**按需載入（不主動觸發就不消耗）：**

| 來源 | 觸發條件 |
|------|---------|
| `.claude/rules/*.md`（有 globs） | Read/Edit 匹配路徑的檔案 |
| `docs/*.md` | Claude 主動 Read 時 |
| Source code 檔案 | Claude Read 時 |

### 8 大 Token 優化策略

#### 策略 1：CLAUDE.md 瘦身（影響最大）
```
Before: 452 行 × 每次 session = 大量浪費
After:  81 行 × 每次 session = 精準指引
```

#### 策略 2：善用 /context 監控
```
在 Claude Code 中輸入 /context
→ 顯示當前 context window 使用量
→ 接近上限前主動 /compact 壓縮
```

#### 策略 3：大檔案分段讀取
```
❌ 讀 3,700 行的 matching.py（~30,000 tokens）
✅ 「只讀 matching.py 的 compute_lust_score 函式」
```

#### 策略 4：及時 /compact
- 長 session 中，完成一個邏輯段落後 `/compact`
- compact 前可加指示：「compact 時保留 XXX 的上下文」
- 或設定 PreCompact hook 自動提示

#### 策略 5：拆分 session
```
❌ 一個 session 做完前端 + 後端 + 測試 + 部署
✅ Session 1: 後端 API 開發
   Session 2: 前端整合
   Session 3: 測試 + 修 bug
```

#### 策略 6：全域 rules 精簡
只保留真正跨所有專案的通用行為（immutability、error handling、commit format）。
TypeScript-specific rules 放專案的 `.claude/rules/` 裡用 globs 控制。

#### 策略 7：指定不讀的範圍
```
「這個任務只改後端 Python，不需要讀前端檔案」
「只看 src/auth/ 目錄，其他不用」
```

#### 策略 8：善用 Agent/Sub-agent 隔離
Sub-agent 有獨立 context window，不會污染主對話。
探索式搜尋用 sub-agent，結果摘要帶回主對話。

### Token 消耗參考

| 操作 | 約略 token |
|------|-----------|
| 200 行 CLAUDE.md | ~1,600 |
| 100 行 rules 檔 | ~800 |
| 讀 500 行原始碼 | ~4,000 |
| 讀 3,000 行原始碼 | ~24,000 |
| 一次完整對話回合 | ~2,000-5,000 |
| Opus 4 context window | ~200,000 |

---

## 3. 對話工作流程

### 單次對話的標準流程

```
1. Session 開始
   ├── CLAUDE.md 自動載入（81 行）
   ├── Auto Memory 自動載入
   ├── 全域 rules 自動載入
   └── Claude 準備就緒

2. 你發出需求
   ├── 簡單問題 → 直接回答
   └── 開發任務 → 進入開發流程 ↓

3. 開發流程
   ├── Claude 讀相關檔案 → 對應 rules 自動載入
   ├── 規劃方案 → 向你確認
   ├── 實作 → Edit/Write 檔案
   ├── 驗證 → 跑測試/型別檢查
   └── 完成 → 回報結果

4. Session 結束前
   ├── /context 檢查用量
   ├── 確認變更已儲存
   └── （可選）記憶重要上下文到 memory
```

### 長 Session 的 Context 管理

```
Context 使用量     建議動作
────────────────────────────────
0-40%              正常開發
40-60%             完成當前任務後 /compact
60-80%             立即 /compact，避免開始新大任務
80%+               開新 session，用 session-state.md 交接
```

### /compact 的正確用法

```bash
# 壓縮前，告訴 Claude 保留什麼
「/compact 時請保留：1) 當前正在改的 API 端點列表 2) 已完成的步驟 3) 下一步計畫」

# 或設定 PreCompact hook 自動提示（見 Hooks 章節）
```

### 多 Session 交接

```bash
# Session 結束前
「寫一份交接筆記到 .claude/session-state.md」

# 新 Session 開始
Claude 自動讀 session-state.md（如果 CLAUDE.md 有寫規則）
或手動：「讀 .claude/session-state.md 接續上次工作」
```

---

## 4. Spec 驅動開發與文件管理

### 推薦目錄結構

```
docs/
├── specs/                    # 功能規格（開發前寫，開發完歸檔）
│   ├── active/               # 當前進行中的 spec
│   │   └── 2026-04-01-user-dashboard.md
│   └── archive/              # 已完成的 spec（只讀參考）
│       └── 2026-03-28-vedic-db.md
├── design/                   # 設計文件
│   ├── DESIGN.md             # 設計系統（色彩、字體、間距）
│   └── wireframes/           # 線框圖
├── decisions/                # 架構決策記錄（ADR）
│   └── 001-choose-supabase.md
├── api/                      # API 文件
│   └── ASTRO-SERVICE.md
├── db/                       # 資料庫文件
│   ├── SCHEMA.md             # 完整 schema 說明
│   └── MIGRATIONS.md         # migration 慣例
└── changelog/                # 版本變更
    └── ALGORITHM-CHANGELOG.md
```

### Spec 的標準模板

```markdown
# Feature: [功能名稱]

## Status: DRAFT → IN_REVIEW → APPROVED → IN_PROGRESS → DONE → ARCHIVED

## Context
為什麼要做這個功能？解決什麼問題？

## Requirements
- [ ] 需求 1
- [ ] 需求 2

## Technical Design
### API Changes
### DB Changes
### Frontend Changes

## Test Plan
- [ ] 單元測試
- [ ] 整合測試

## Rollback Plan
如果出問題怎麼退回？
```

### 文件迭代更新規則

| 事件 | 需要更新的文件 | 誰負責 |
|------|--------------|--------|
| 新功能開始 | 建立 `docs/specs/active/` 下的 spec | 開發者 |
| Spec 審核通過 | Status → APPROVED | 審核者 |
| 實作完成 | spec 移到 `archive/`，更新 CLAUDE.md 版本號 | 開發者 |
| API 變更 | 更新 `docs/api/`、rules 的端點表 | 開發者/Claude |
| DB schema 變更 | 更新 `docs/db/SCHEMA.md` | 開發者/Claude |
| 設計變更 | 更新 `DESIGN.md` | 開發者 |
| 算法變更 | 更新 changelog + CLAUDE.md 版本號 + memory | 開發者/Claude |
| PR 合併後 | 跑 `/document-release` 檢查文件同步 | 開發者 |

### PR 合併後 Spec 同步 Checklist

```markdown
## PR 合併後 Checklist
- [ ] spec status 改為 DONE，移到 archive/
- [ ] CLAUDE.md 版本號更新（如有版本升級）
- [ ] .claude/rules/ 中受影響的 rules 更新
- [ ] docs/ 中的 API / DB 文件同步
- [ ] DESIGN.md 更新（如有 UI 變更）
- [ ] Auto Memory 更新（如有重要架構變更）
- [ ] ALGORITHM-CHANGELOG.md 更新（如有算法變更）
```

### 哪些文件要進 Git？

見 [第 10 章 Git 工作流](#10-git-工作流) 的完整對照表。

---

## 5. 大型專案導入策略（Legacy Infra 翻新）

### 核心問題

> 「專案太大，內規太多，AI 感覺很難掌握完整上下文」

**解法：AI 不需要一次掌握全部。它需要一個導航系統。**

### 5 步導入流程

#### Step 1：建立專案地圖（1-2 天）

```markdown
# CLAUDE.md（<200 行）
## 專案概覽
- 這是什麼系統？
- 幾個主要模組？
- 技術棧？
- 關鍵陷阱（不寫必出事的規則）？

## 模組索引
| 模組 | 路徑 | 對應 rules | 負責人 |
|------|------|-----------|--------|
| 使用者管理 | src/user/ | rules/user.md | Alice |
| 訂單系統 | src/order/ | rules/order.md | Bob |
| 報表引擎 | src/report/ | rules/report.md | Carol |

## 文件索引
| 文件 | 路徑 | 何時讀 |
|------|------|--------|
| DB Schema | docs/db/SCHEMA.md | 改資料庫時 |
| API 文件 | docs/api/ | 改 API 時 |
| 部署手冊 | docs/DEPLOYMENT.md | 部署時 |
```

#### Step 2：逐模組建立 Rules（每模組 1-2 小時）

```markdown
# .claude/rules/order.md
---
globs: src/order/**,src/api/order/**
---
## 訂單模組規則
- 訂單狀態機：DRAFT → PENDING → PAID → SHIPPED → COMPLETED
- 狀態轉換必須透過 OrderStateMachine.transition()
- 金額計算一律用 Decimal，禁止 float
- 所有訂單操作必須記錄 audit_log
```

#### Step 3：讓 AI 自己探索並補全

```
「用 sub-agent 探索 src/order/ 目錄，找出所有公開 API、
  DB 操作、狀態轉換邏輯，然後更新 .claude/rules/order.md
  補上你發現但我沒寫的重要規則」
```

#### Step 4：建立 DB Schema 文件（見第 6 章）

#### Step 5：漸進式擴展

```
Week 1: 核心模組（使用者、訂單）建立 rules
Week 2: 次要模組（報表、通知）
Week 3: 共用模組（auth、logging、config）
Week 4: 整合測試、部署流程
```

### 大型 Monorepo 的 Rules 架構範例

```
.claude/rules/
├── general.md              # globs 不設（全域生效）— 共用慣例
├── user-service.md         # globs: services/user/**
├── order-service.md        # globs: services/order/**
├── payment-gateway.md      # globs: services/payment/**
├── shared-db.md            # globs: **/repositories/**,**/migrations/**
├── api-gateway.md          # globs: gateway/**
└── deployment.md           # globs: infra/**,docker/**,.github/**
```

### 多個舊專案整合到一個平台

```
Phase 1: 盤點
  「列出所有子系統、技術棧、DB、API 邊界」

Phase 2: 統一入口
  建立 umbrella CLAUDE.md，指向各子系統的 rules

Phase 3: 逐系統遷移
  每次遷移一個子系統，用 spec 驅動：
  docs/specs/active/migrate-order-system.md

Phase 4: 整合層
  建立共用 rules（auth、logging、error format）
```

---

## 6. 資料庫知識注入

### 問題

> 「專案缺少完整資料庫設計文件，MSSQL 居多，怎麼讓 AI 理解？」

### 方案 1：自動抽取 Schema（推薦）

```sql
-- 讓 Claude 跑這段 SQL 產生 schema 文件
SELECT
    t.TABLE_SCHEMA,
    t.TABLE_NAME,
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.IS_NULLABLE,
    c.COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.TABLES t
JOIN INFORMATION_SCHEMA.COLUMNS c
    ON t.TABLE_NAME = c.TABLE_NAME
WHERE t.TABLE_TYPE = 'BASE TABLE'
ORDER BY t.TABLE_SCHEMA, t.TABLE_NAME, c.ORDINAL_POSITION;
```

```
「把這份 SQL 結果整理成 docs/db/SCHEMA.md，格式為每張表一個區塊，
  含欄位名、型別、nullable、說明（從欄位名推測用途）」
```

### 方案 2：建立 DB Rules 檔

```markdown
# .claude/rules/database.md
---
globs: **/repositories/**,**/dal/**,**/migrations/**,**/*Repository*,**/*Dao*
---

## 資料庫規範（MSSQL）

### 連線
- 使用 connection pool，不要每次 new connection
- Transaction 用 `BEGIN TRAN ... COMMIT`，不用 auto-commit
- 讀操作加 `WITH (NOLOCK)` 在可接受 dirty read 的場景

### 命名慣例
- Table: PascalCase（`OrderDetail`）
- Column: PascalCase（`CreatedDate`）
- SP: `usp_模組_動作`（`usp_Order_GetById`）
- Index: `IX_表名_欄位`

### 關鍵 Tables（速查）
| Table | 用途 | 主鍵 | 常見 JOIN |
|-------|------|------|----------|
| Users | 使用者 | UserId (int) | → Orders.UserId |
| Orders | 訂單 | OrderId (int) | → OrderDetails |
| Products | 商品 | ProductId (int) | → OrderDetails |

### 常見陷阱
- `datetime` vs `datetime2`：新欄位一律用 `datetime2(7)`
- `varchar` vs `nvarchar`：含中文一律 `nvarchar`
- 大表 UPDATE/DELETE 前必須確認影響行數（`SELECT COUNT(*) FROM ... WHERE ...`）
- 禁止 `SELECT *`，一律列出需要的欄位
```

### 方案 3：漸進式學習

不一定要一次寫完所有 schema 文件。可以在 rules 裡放指引：

```markdown
## DB 知識取得流程
改 DB 相關程式碼前，先執行：
1. 讀 docs/db/SCHEMA.md（如果存在）
2. 如果文件不存在或不含目標表，查詢 INFORMATION_SCHEMA 取得 schema
3. 完成開發後，將新發現的 schema 補回 docs/db/SCHEMA.md
```

---

## 7. 團隊規範制定

### 導入 Claude Code 的 4 步流程

#### Step 1：建立組織級全域 rules

每個團隊成員的 `~/.claude/rules/` 放相同的精簡通用規則：

```markdown
# ~/.claude/rules/team-conventions.md（建議 <100 行）

## 語言
- 回覆用繁體中文
- Code / identifiers 用英文
- Commit message 用英文 conventional commits

## 安全
- 禁止 hardcode secrets
- 禁止 console.log 進 production
- SQL 一律 parameterized query

## Code Style
- 函式 <50 行
- 檔案 <800 行
- 不 mutate 物件（immutable pattern）

## Git
- Conventional commits: feat/fix/refactor/docs/test/chore
- PR 必須有描述和測試計畫
```

> **分發方式**：寫成一個 setup script，新人跑一次就裝好：
> ```bash
> mkdir -p ~/.claude/rules
> curl -o ~/.claude/rules/team-conventions.md https://internal-repo/claude-rules/team.md
> ```

#### Step 2：建立專案級 rules 模板

```
.claude/
├── settings.json          # 團隊共享設定（進 Git）
├── settings.local.json    # 個人設定（不進 Git）
└── rules/
    ├── general.md         # 專案通用規則
    ├── api.md             # API 開發規則（globs: src/api/**)
    ├── frontend.md        # 前端規則（globs: src/pages/**)
    └── database.md        # DB 規則（globs: **/dal/**)
```

#### Step 3：制定 CLAUDE.md 模板

為組織建立標準 CLAUDE.md 模板：

```markdown
# CLAUDE.md Template

## Language
[預設語言]

## Project Overview
[1-3 句話描述專案]
- **Tech Stack:** [列出]
- **DB:** [類型 + 版本]

## Key Documentation
| 文件 | 用途 |
|------|------|

## Module Index
| 模組 | 路徑 | Rules | 負責人 |
|------|------|-------|--------|

## Dev Commands
[啟動、測試、部署指令]

## Conventions
[5-10 條最重要的行為規則]
```

#### Step 4：建立 Onboarding SOP

```markdown
## 新人 Claude Code Onboarding

### Day 1
1. 安裝 Claude Code CLI
2. 執行 setup script 安裝全域 rules
3. Clone 專案，確認 .claude/ 目錄存在
4. 跑 `claude` 啟動，確認 CLAUDE.md 載入正確

### Day 2
1. 讀本份最佳實踐指南
2. 練習：用 Claude 完成一個小 bug fix
3. 練習：用 /context 監控 token 用量

### Day 3
1. 練習：用 spec 驅動方式開發一個小功能
2. 練習：跑 /review 做 PR review
3. 了解 hooks 和 auto memory 機制
```

### 組織特有 Rules 的撰寫原則

1. **寫「不寫會出事」的規則**，不寫「大家都知道」的常識
2. **用反例說明**：`❌ SELECT * FROM ...` → `✅ SELECT Id, Name FROM ...`
3. **每條 rule 附上「為什麼」**：方便判斷邊界情況
4. **定期清理**：每季 review，刪除過時規則
5. **保持精簡**：每個 rules 檔 <150 行

---

## 8. Auto Memory 管理

### 存儲結構

```
~/.claude/projects/<sanitized-cwd>/memory/
├── MEMORY.md              # 索引檔（始終載入，<200 行）
├── user_role.md            # 使用者資訊
├── feedback_testing.md     # 行為回饋
├── project_migration.md    # 專案狀態
└── reference_jira.md       # 外部系統指標
```

### 4 種記憶類型

| 類型 | 用途 | 何時存 | 範例 |
|------|------|--------|------|
| **user** | 使用者角色、偏好、知識水平 | 學到使用者資訊時 | 「使用者是資深後端，React 新手」 |
| **feedback** | 行為修正（要做/不做） | 使用者糾正方向時 | 「不要在每次回應末尾總結」 |
| **project** | 進行中的工作、決策、截止日 | 學到專案狀態時 | 「3/15 前 merge freeze」 |
| **reference** | 外部系統位置 | 學到外部資源時 | 「bug 追蹤在 Linear INGEST 專案」 |

### 不該存的內容

- 程式碼模式、架構、檔案路徑（可從 codebase 推導）
- Git 歷史（`git log` 取得）
- Debug 解法（修復在程式碼裡，commit message 有上下文）
- 已在 CLAUDE.md 中的內容（重複）
- 暫時性的 task 進度（用 Tasks 工具追蹤）

### 團隊管理建議

**Memory 是個人的，不共享。** 每個團隊成員有自己的 memory 目錄。

團隊知識應放在**共享的**位置：

| 知識類型 | 個人 Memory | 共享位置 |
|---------|------------|---------|
| 「我偏好精簡回覆」 | ✅ memory | ❌ |
| 「API 用 REST 不用 GraphQL」 | ❌ | ✅ CLAUDE.md 或 rules |
| 「Sprint 3/15 結束」 | ✅ memory (project) | ❌ |
| 「DB 連線字串在 Vault」 | ✅ memory (reference) | ✅ 也放 rules |

---

## 9. Hooks 強制機制

### Hooks 是什麼？

在 Claude Code 的生命週期事件中自動執行的 shell 指令。用來**強制執行規範**，而非依賴 AI「記得」。

### 常用 Hook 事件

| 事件 | 觸發時機 | 典型用途 |
|------|---------|---------|
| `PostToolUse` | 工具執行後 | 自動 lint / format / type check |
| `PreToolUse` | 工具執行前 | 攔截危險操作 |
| `PreCompact` | 壓縮前 | 提示保留重要上下文 |
| `Stop` | Claude 停止時 | 最終驗證 |
| `UserPromptSubmit` | 使用者送出訊息時 | 記錄操作日誌 |
| `SessionStart` | Session 開始 | 環境檢查 |

### 團隊推薦 Hooks

#### 1. 編輯後自動型別檢查（TypeScript 專案）

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "node -e \"const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); const f=(d.tool_input||{}).file_path||''; if(!/\\.(ts|tsx)$/.test(f))process.exit(0); require('child_process').execSync('npx tsc --noEmit 2>&1 | head -20',{cwd:'.',stdio:'inherit',timeout:30000})\" 2>/dev/null || true",
        "timeout": 35,
        "statusMessage": "Type checking..."
      }]
    }]
  }
}
```

#### 2. 編輯後自動格式化

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; prettier --write \"$f\"; } 2>/dev/null || true"
      }]
    }]
  }
}
```

#### 3. 防止提交 secrets

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' | grep -qE 'git (add|commit)' && { git diff --cached --diff-filter=ACM | grep -iE '(api_key|secret|password|token)\\s*=' && echo '{\"decision\":\"block\",\"reason\":\"Possible secrets detected in staged files\"}' || true; } || true"
      }]
    }]
  }
}
```

#### 4. Compact 前保留上下文

```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "manual|auto",
      "hooks": [{
        "type": "command",
        "command": "echo '{\"systemMessage\":\"Compact 提醒：請保留當前任務的 spec 路徑、已完成步驟、待辦項目。\"}'"
      }]
    }]
  }
}
```

### Hooks 放哪裡？

| 檔案 | 範圍 | Git | 用途 |
|------|------|-----|------|
| `.claude/settings.json` | 專案 | ✅ 進 Git | 團隊共享 hooks |
| `.claude/settings.local.json` | 專案 | ❌ 不進 Git | 個人 hooks |
| `~/.claude/settings.json` | 全域 | N/A | 跨專案 hooks |

**團隊強制 hooks 放 `.claude/settings.json`（進 Git），個人偏好放 `.local.json`。**

---

## 10. Git 工作流

### 完整「哪些上 Git / 哪些不上」對照表

| 檔案 / 目錄 | 上 Git？ | 原因 |
|---|---|---|
| `CLAUDE.md` | ✅ | 團隊共享的專案指引 |
| `DESIGN.md` | ✅ | 設計系統定義 |
| `.claude/settings.json` | ✅ | 團隊共享設定 + hooks |
| `.claude/rules/*.md` | ✅ | 團隊共享的模組規則 |
| `.claude/agents/*.md` | ✅ | 自訂 agent 定義 |
| `.claude/skills/*/SKILL.md` | ✅ | 自訂 skill 定義 |
| `docs/**` | ✅ | 所有文件 |
| `.claude/settings.local.json` | ❌ | 個人設定（加入 .gitignore） |
| `~/.claude/` | N/A | 全域設定，不在 repo 中 |
| `~/.claude/rules/` | N/A | 全域 rules，不在 repo 中 |
| `~/.claude/projects/*/memory/` | N/A | 個人 auto memory |
| `.claude/session-state.md` | ❌ | 暫時性交接筆記 |

### .gitignore 建議

```gitignore
# Claude Code - personal / ephemeral
.claude/settings.local.json
.claude/session-state.md
```

### 團隊協作 5 步 Git 流程

```
Step 1: 開分支
  git checkout -b feat/user-dashboard

Step 2: 開發（Claude Code 協助）
  - 用 spec 驅動開發
  - hooks 自動檢查品質
  - 完成後跑 /review

Step 3: 提交
  - Conventional commits
  - Claude 協助寫 commit message
  - hooks 自動攔截 secrets

Step 4: PR
  - /ship 或 /create-pr 建立 PR
  - Claude 自動產生 PR 描述
  - 跑 /review 做 pre-landing review

Step 5: 合併後
  - /document-release 更新文件
  - 確認 CLAUDE.md / rules 同步
  - spec 歸檔到 archive/
```

---

## 11. Skills 操作與團隊整合

### 核心概念

**Skill** = 可重複使用的 prompt 工作流，用 `/skill-name` 觸發。

### 多 Session vs 單 Session

| 情境 | 建議 | 原因 |
|------|------|------|
| 規劃 + 實作 | **分開** session | Plan 階段不需要程式碼的 context |
| 前端 + 後端同一功能 | **同一** session | 需要看到兩邊的互動 |
| 獨立的 bug fix | **分開** session | 各自隔離，不污染 context |
| Review + Ship | **同一** session | 連貫的 QA → 發佈流程 |
| 多個不相關任務 | **分開** session | 避免 context 混亂 |

### 同一 Session 內的 Skill 順序

```
功能開發標準流程：
  /office-hours（釐清需求）
  → /plan（寫 spec + 實作計畫）
  → /plan-ceo-review（策略審查）
  → /plan-eng-review（技術審查）
  → 開始實作
  → /review（PR review）
  → /ship（建立 PR）
  → /document-release（更新文件）

快速 bug fix：
  /investigate（找根因）
  → 修復
  → /review
  → /ship
```

### 多 Skill 同時呼叫？

**不行**——一次只能跑一個 skill。但你可以：

1. **依序呼叫**：完成一個再啟動下一個
2. **用 /autoplan 一次跑完 review 流水線**：CEO → Eng → Design review 自動串接
3. **用 Agent tool 並行子任務**：skill 內部可以 spawn 多個 sub-agent

### gstack 團隊整合範例

gstack 是一套 skill 生態系統，提供完整的開發工作流。

#### 安裝（團隊統一版本）

```bash
# 每個成員執行
git clone https://github.com/anthropics/gstack ~/.claude/skills/gstack
```

#### 團隊常用 gstack Skills

| Skill | 用途 | 何時用 |
|-------|------|--------|
| `/office-hours` | 需求釐清 + brainstorm | 功能開始前 |
| `/plan-ceo-review` | 策略/範圍審查 | Spec 寫完後 |
| `/plan-eng-review` | 架構/技術審查 | 技術設計完成後 |
| `/plan-design-review` | UI/UX 審查 | 有前端變更時 |
| `/autoplan` | 自動跑完所有 review | 想一次搞定時 |
| `/review` | PR pre-landing review | 提交 PR 前 |
| `/ship` | 建立 PR + push | 程式碼就緒時 |
| `/qa` | 系統性 QA 測試 | 功能完成後 |
| `/investigate` | 系統性 debug | 遇到 bug 時 |
| `/document-release` | 同步文件 | PR 合併後 |
| `/design-review` | 視覺 QA | 上線前 |
| `/browse` | 無頭瀏覽器測試 | 驗證前端功能 |

#### 團隊工作流範例

```
PM 寫需求
  → 開發者：/office-hours 釐清
  → 開發者：/plan 寫 spec
  → Tech Lead：/plan-eng-review 審查
  → 開發者：實作
  → 開發者：/review 自我 review
  → 開發者：/ship 建立 PR
  → Reviewer：/review 審查 PR
  → 合併後：/document-release 同步文件
```

#### 自訂團隊 Skill

```bash
mkdir -p .claude/skills/deploy
cat > .claude/skills/deploy/SKILL.md << 'EOF'
---
name: deploy
description: 部署到 staging/production
---
# Deploy Skill
1. 確認當前分支和 commit
2. 跑完整測試
3. 確認環境變數正確
4. 執行部署指令
5. 驗證 health check
6. 回報部署結果
EOF
```

---

## 12. 安全與合規

### Claude Code 安全 Checklist

```markdown
## 每個專案必備
- [ ] .env / .env.local 在 .gitignore 中
- [ ] .claude/settings.local.json 在 .gitignore 中
- [ ] CLAUDE.md 不含任何 secrets
- [ ] rules 檔案不含任何 secrets
- [ ] Auto memory 不含任何 secrets

## Hooks 安全
- [ ] PreToolUse hook 攔截 secrets 提交
- [ ] 不在 hooks 中寫入 secrets

## 團隊規範
- [ ] 全域 rules 有安全準則（SQL injection, XSS 等）
- [ ] API key 管理走環境變數或 secret manager
- [ ] Claude Code 的 permissions 適當設定
```

### Permissions 建議

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(DROP:*)",
      "Bash(TRUNCATE:*)"
    ]
  }
}
```

---

## 附錄 A：Quick Reference Card

```
/context          查看 token 用量
/compact          壓縮上下文
/hooks            管理 hooks
/memory           查看 auto memory
/review           PR review
/ship             建立 PR
/plan             進入 plan mode
Ctrl+C            中斷當前操作
Esc               取消當前輸入
```

## 附錄 B：Checklist — 新專案接入 Claude Code

```markdown
## Day 0：基礎建設
- [ ] 建立 CLAUDE.md（<200 行）
- [ ] 建立 .claude/rules/（按模組分檔 + globs）
- [ ] 建立 .claude/settings.json（團隊 hooks）
- [ ] 更新 .gitignore（加 settings.local.json）
- [ ] 建立 docs/ 目錄結構

## Day 1：內容填充
- [ ] CLAUDE.md 寫專案概覽 + 技術棧 + dev commands + 行為規則
- [ ] 各 rules 檔寫模組規則
- [ ] 建立 DB schema 文件（如有需要）
- [ ] 設定團隊共享 hooks

## Day 2：驗證
- [ ] 新 session 啟動，確認 CLAUDE.md 載入正確
- [ ] 編輯各模組檔案，確認對應 rules 觸發
- [ ] 跑 /context 確認 token 用量合理
- [ ] 團隊成員試用，收集回饋

## 持續維護
- [ ] 每次 PR 後檢查文件同步
- [ ] 每月 review rules（刪除過時、補充遺漏）
- [ ] 每季 review CLAUDE.md（版本號、技術棧更新）
```

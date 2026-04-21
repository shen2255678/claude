# Harness Engineering — 15 分鐘快速開始

適合急著開始的人。完整文檔見 [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)

---

## ✅ Step 1: 克隆倉庫（2 分鐘）

```bash
git clone https://github.com/shen2255678/claude.git my-ai-project
cd my-ai-project
git remote set-url origin <your-new-repo>
```

---

## ✅ Step 2: 建立三個核心目錄（1 分鐘）

```bash
# 已經存在，無需建立：
# .claude/memory/      ← Session 記憶
# .claude/rules/       ← 條件化規則
# docs/                ← 文檔驅動開發
```

---

## ✅ Step 3: 建立 MEMORY.md（3 分鐘）

編輯 `.claude/memory/MEMORY.md`，新增你的第一條記錄：

```markdown
# 專案記憶 — [你的專案名]

## 當前進度

### ✅ 完成
- (無)

### 🔄 進行中
- 初始化 Harness Engineering 系統

### ⏳ 待做
- 編輯 docs/SPEC.md（系統規範）
- 編輯 .claude/rules/ 根據技術棧
- 第一次提交

## 重要決策
- (無)

## 已知問題
- (無)

---
更新時間：2026-04-21
```

---

## ✅ Step 4: 編輯系統規範（5 分鐘）

編輯 `docs/DESTINY-MVP-SPEC.md`（改名為你的項目名）

**最小版本**：

```markdown
# [你的專案] — MVP 規範

## 項目概述
一句話說明你的項目做什麼。

例：一個支持多模型 LLM 的 AI 應用系統，提供個性化推薦。

## 技術棧
- Frontend: Next.js / React / Vue
- Backend: Python FastAPI / Node.js
- Database: PostgreSQL / MongoDB
- LLM: Claude / GPT / Gemini

## 核心功能
1. 用戶認證
2. 數據輸入
3. AI 推理
4. 結果展示

## 成功指標
- 支持 X 個並發用戶
- API 響應 < 2 秒
- 準確率 > 85%

---
版本：1.0
最後更新：2026-04-21
```

---

## ✅ Step 5: 建立規則文件（3 分鐘）

根據你的技術棧保留對應的規則文件，刪除不需要的。

**保留這些**（例如用 FastAPI + Next.js）：
- `.claude/rules/docs-first.md` — 實作前讀文檔
- `.claude/rules/astro-service.md` — 後端服務規則
- `.claude/rules/frontend.md` — 前端規則
- `.claude/rules/api-security.md` — 安全規則

**刪除這些**（不相關的）：
```bash
rm .claude/rules/supabase.md    # 如果不用 Supabase
rm .claude/rules/weights-tuning.md  # 如果不用機器學習
```

---

## ✅ Step 6: 第一次提交（1 分鐘）

```bash
git add .
git commit -m "chore: initialize Harness Engineering system

- Set up .claude/memory/ for cross-session context
- Configure .claude/rules/ for conditional loading
- Initialize docs/ with core documentation templates
- Create MEMORY.md for project progress tracking

This system enables:
✓ New team members onboarding in 1 day
✓ Cross-session handoff in 5 minutes
✓ Complete decision traceability
✓ 50%+ faster delivery cycle"

git push -u origin main
```

---

## 🎯 現在你可以開始了

### 在 Claude Code 中使用：

```
1. 打開你的項目
2. 開始編輯代碼
3. 系統自動加載 `.claude/rules/` 中的檢查清單
4. 完成後更新 `.claude/memory/MEMORY.md`
```

### 編輯流程：

```
編輯 backend/services/*.py 
  → 自動加載 astro-service.md
  → 檢查清單提醒：「檢查錯誤處理」「更新 API 文檔」

編輯 frontend/components/*.tsx
  → 自動加載 frontend.md
  → 檢查清單提醒：「檢查 accessibility」「添加單元測試」
```

---

## 📚 下一步

- **完整指南**：[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
- **文檔分類**：[docs/README.md](./docs/README.md)
- **項目範例**：[examples/destiny-project/](./examples/destiny-project/)

---

## 💡 常見問題

**Q: 我需要修改哪些文件？**  
A: 最少修改：
- `docs/DESTINY-MVP-SPEC.md` → 改成你的系統規範
- `.claude/rules/` → 刪除不相關的規則
- `.claude/memory/MEMORY.md` → 記錄你的進度

**Q: 第一次提交後怎麼用？**  
A: 每個 session 開始時：
1. 讀 `.claude/memory/MEMORY.md`
2. 編輯代碼
3. 系統自動提醒檢查清單
4. 完成時更新 MEMORY.md

**Q: 整個系統花多久建立？**  
A: 
- 快速開始（本指南）：15 分鐘
- 完整實施：6-8 週（包括全隊協作和流程沉澱）

---

**準備好了嗎？** → [git add . && git commit && git push](./IMPLEMENTATION-GUIDE.md)

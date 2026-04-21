# DESTINY 實戰 — Claude Code 工作流快速導覽

在有 2000+ 用戶的生產系統中，怎麼用 Claude Code 提高開發效率？本指南帶你快速理解。

完整文檔見 [CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md)

---

## 📊 DESTINY 的三層上下文結構

```
Layer 1: CLAUDE.md (81 行 × 每次 session)
  └─ 永遠載入
    ├─ 專案概覽（DESTINY 是什麼）
    ├─ 技術棧（Next.js + FastAPI + Supabase）
    ├─ 關鍵陷阱（算法版本、資料品質、API 規範）
    └─ 模組索引（後端、前端、數據層）

Layer 2: .claude/rules/ (按路徑條件載入)
  ├─ astro-service.md    (globs: astro-service/**)
  ├─ frontend.md         (globs: src/pages/**)
  ├─ api-security.md     (globs: src/api/**)
  └─ supabase.md         (globs: migrations/**)

Layer 3: docs/ (主動讀取)
  ├─ ALGORITHM.md        → 改推薦邏輯時讀
  ├─ DESIGN-DECISIONS.md → 「為什麼這樣」
  ├─ TESTING-GUIDE.md    → 寫測試時讀
  └─ DEPLOYMENT.md       → 發佈時讀
```

**效果**：
- Session 開始消耗：~2,400 tokens（不是 50,000+）
- 編輯後端時，自動看到後端規則（不是無關的前端規則）
- 新人第一天就能理解「為什麼」

---

## ✅ Step 1: 了解結構（5 分鐘）

```bash
# 1. 看主入口
cat CLAUDE.md          # 81 行的上下文

# 2. 看條件規則
ls -la .claude/rules/  # 模組級別的規則

# 3. 看完整文檔
ls -la docs/           # 12+ 核心文檔
```

---

## ✅ Step 2: 讀最佳實踐（30 分鐘）

```
CLAUDE-CODE-BEST-PRACTICES.md 包含 12 章：

1. 三層上下文架構（你現在讀的）
2. Token 成本控管（如何省 token）
3. 對話工作流程
4. Spec 驅動開發與文件管理
5. 大型專案導入策略 ← 如果你要應用到自己的項目
6. 資料庫知識注入
7. 團隊規範制定
8. Auto Memory 管理
9. Hooks 強制機制
10. Git 工作流
11. Skills 操作與團隊整合
12. 安全與合規
```

---

## ✅ Step 3: 探索實際的文件（1 小時）

```bash
# 看實際的上下文入口
cat CLAUDE.md

# 看後端規則（globs: astro-service/**)
cat .claude/rules/astro-service.md

# 看前端規則（globs: src/pages/**)
cat .claude/rules/frontend.md

# 看完整的系統規範
cat docs/DESTINY-MVP-SPEC.md

# 看 40+ 設計決策
cat docs/DESIGN-DECISIONS.md

# 看算法版本歷史
cat docs/ALGORITHM-CHANGELOG.md
```

---

## ✅ Step 4: 理解「為什麼這樣」

### 為什麼要分三層？

```
❌ 所有文件都載入
  session 開始 → 一次載入 100KB+ 文檔
  → 消耗 50,000+ tokens
  → 很多不相關的內容

✅ 分層載入（DESTINY 實踐）
  session 開始 → 只載 CLAUDE.md (81 行)
              → 編輯後端時載 astro-service.md
              → 需要細節時主動讀 docs/
  → 消耗 2,400 tokens
  → 精準的、相關的內容
```

### 為什麼要條件化規則？

```
❌ 一個 100 行的 rules 檔
  編輯 Python，也載到
  編輯 TypeScript，也載到
  → 衝突、混亂、token 浪費

✅ globs 條件化（DESTINY 實踐）
  編輯 astro-service/**, 自動載 astro-service.md
  編輯 src/pages/**, 自動載 frontend.md
  → 自動、精準、無衝突
```

---

## 🎯 實踐：你的第一個開發循環

### 假設：改進推薦算法

```
1. Session 開始
   CLAUDE.md 自動載入
   Claude 知道：這是推薦算法，看 ALGORITHM.md

2. 讀文檔
   打開 docs/ALGORITHM.md
   看到：當前版本是 v2.3，修改歷史在 ALGORITHM-CHANGELOG.md

3. 編輯代碼
   編輯 astro-service/matching.py
   .claude/rules/astro-service.md 自動載入
   提醒：
     ✓ 更新 ALGORITHM-CHANGELOG.md
     ✓ 修改完要在 DESIGN-DECISIONS.md 記錄「為什麼改」
     ✓ 跑完整測試（見 TESTING-GUIDE.md）

4. 完成
   更新 .claude/memory/MEMORY.md
   記錄：「完成算法優化，v2.3 → v2.4」

5. 交接
   下次 session，新人讀 MEMORY.md
   5 分鐘內理解：「上次改了什麼」「當前狀態」「下一步」
```

---

## 📈 效果對標

| 情境 | 傳統流程 | DESTINY 實踐 | 改善 |
|------|---------|-----------|------|
| **新人上手** | 1 週 | 1 天 | 7x |
| **Session 交接** | 30 分 | 5 分 | 6x |
| **找「為什麼」** | 問人 + 讀代碼 | DESIGN-DECISIONS.md | 10x |
| **改演算法** | 修改 + 手工測試 | 規則 + checklist | 3x |
| **文檔同步** | 經常遺漏 | 100% 同步 | ∞ |

---

## 💡 常見問題

**Q: CLAUDE.md 為什麼只有 81 行？**  
A: 因為它要「永遠載入」。每次 session 多 100 行，就浪費 800 tokens。81 行是在「有用」和「省 token」之間的平衡點。

**Q: 我怎麼知道要改什麼 rules？**  
A: 根據你的技術棧：
- 用 FastAPI？保留 astro-service.md
- 用 Next.js？保留 frontend.md
- 用 PostgreSQL？保留 supabase.md
- 等等

詳見 [CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md) 第 5 章

**Q: 新 Session 開始，Claude 會自動讀 MEMORY.md 嗎？**  
A: 不會自動，但應該在 CLAUDE.md 中提醒：
```
## Session 交接
開始前，讀 .claude/memory/MEMORY.md 了解上次進度
```

---

## 📚 下一步

- **完整的 12 章最佳實踐**：[CLAUDE-CODE-BEST-PRACTICES.md](./CLAUDE-CODE-BEST-PRACTICES.md)
- **DESTINY 的實際文檔**：[docs/DESTINY-MVP-SPEC.md](./docs/DESTINY-MVP-SPEC.md)
- **應用到自己項目**：第 5 章 — 大型專案導入策略（5 步流程）

---

**核心概念**：不是「複製模板」，而是「理解為什麼 DESTINY 要這樣設計」。

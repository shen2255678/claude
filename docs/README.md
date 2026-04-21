# 文檔中心 — 核心文檔導航

這個文件夾包含所有項目文檔。採用「規範 → 參考 → 指南 → 檔案 → 追蹤」的分類體系。

---

## 📚 文檔分類和用途

### 1️⃣ 規範文檔（Spec）

用於新人上手和系統全景理解。**每季度更新一次**。

| 文檔 | 用途 | 更新頻率 |
|------|------|--------|
| **[PROJECT]-MVP-SPEC.md** | 完整的系統設計藍圖 | 每季度 |
| **TECH-STACK.md** | 技術選擇與為什麼 | 每季度 |

**新人上手路線**：
1. 讀 [PROJECT]-MVP-SPEC.md （了解系統整體）
2. 讀 TECH-STACK.md （理解為什麼選這些技術）
3. 查詢對應的參考/指南文檔

---

### 2️⃣ 參考文檔（Reference）

用於查詢技術細節和常數表。**月度更新**。

| 文檔 | 用途 | 更新頻率 |
|------|------|--------|
| **ALGORITHM.md** | 演算法邏輯與版本歷史 | 月度 |
| **DESIGN-DECISIONS.md** | 架構決策（為什麼選擇這個） | 按需 |
| **WEIGHTS-TUNING-GUIDE.md** | 參數調整表（如果有機器學習） | 月度 |

**使用場景**：
- 「為什麼用 FastAPI 而不是 Django？」→ DESIGN-DECISIONS
- 「匹配算法的當前版本是什麼？」→ ALGORITHM
- 「我要調整推薦模型的權重」→ WEIGHTS-TUNING-GUIDE

---

### 3️⃣ 指南文檔（Guide）

用於具體任務的操作步驟。**按需更新**。

| 文檔 | 用途 | 更新頻率 |
|------|------|--------|
| **DEPLOYMENT.md** | 部署流程（step-by-step） | 版本發佈時 |
| **TESTING-GUIDE.md** | 測試戰略和檢查清單 | 月度 |
| **PROMPT-GUIDE.md** | LLM Prompt 工程指南 | 月度 |
| **API-GUIDE.md** | API 使用手冊 | 按需 |

**使用場景**：
- 「我要部署新版本」→ DEPLOYMENT
- 「我要寫這個功能的測試」→ TESTING-GUIDE
- 「我要優化 LLM prompt」→ PROMPT-GUIDE

---

### 4️⃣ 檔案文檔（Archive）

一次性記錄的決策、分析等。**不常更新**。

| 文檔 | 用途 |
|------|------|
| **PERFORMANCE-ANALYSIS.md** | 性能基準測試報告 |
| **SECURITY-AUDIT.md** | 安全審計結果 |
| **LESSONS-LEARNED.md** | 過去項目的經驗教訓 |

---

### 5️⃣ 追蹤文檔（Changelog）

記錄版本演進和最近改動。**每次變更更新**。

| 文檔 | 用途 | 更新頻率 |
|------|------|--------|
| **ALGORITHM-CHANGELOG.md** | 演算法版本歷史 | 每次改動 |
| **DEPLOYMENT-CHANGELOG.md** | 部署歷史（版本發佈） | 每次發佈 |

**使用場景**：
- 「上週我們改了什麼？」→ ALGORITHM-CHANGELOG
- 「v1.2.1 都修復了什麼 bug？」→ DEPLOYMENT-CHANGELOG

---

## 🚀 快速查找

**我想...**

| 需求 | 查看文檔 |
|------|--------|
| 理解整個系統 | `[PROJECT]-MVP-SPEC.md` |
| 知道為什麼選某個技術 | `DESIGN-DECISIONS.md` |
| 部署新版本 | `DEPLOYMENT.md` |
| 寫測試 | `TESTING-GUIDE.md` |
| 優化 LLM prompt | `PROMPT-GUIDE.md` |
| 查詢 API 端點 | `API-GUIDE.md` 或 Swagger |
| 了解演算法 | `ALGORITHM.md` |
| 看過去發生了什麼 | `ALGORITHM-CHANGELOG.md` |

---

## 📖 文檔模板列表

### 已提供的模板

- ✅ SPEC 模板（在 IMPLEMENTATION-GUIDE 中）
- ✅ DESIGN-DECISIONS 模板
- ✅ TESTING-GUIDE 模板

### 等待你創建的文檔

在 `IMPLEMENTATION-GUIDE.md` 中有詳細的創建步驟：

- [ ] [PROJECT]-MVP-SPEC.md
- [ ] ALGORITHM.md
- [ ] ALGORITHM-CHANGELOG.md
- [ ] DEPLOYMENT.md
- [ ] TESTING-GUIDE.md
- [ ] PROMPT-GUIDE.md
- [ ] TECH-STACK.md
- [ ] DESIGN-DECISIONS.md
- [ ] API-GUIDE.md（或 Swagger）
- [ ] WEIGHTS-TUNING-GUIDE.md（如有機器學習）

---

## 🔗 相關資源

- **主文檔**：[README.md](../README.md)
- **快速開始**：[QUICK-START.md](../QUICK-START.md)
- **完整實施指南**：[IMPLEMENTATION-GUIDE.md](../IMPLEMENTATION-GUIDE.md)
- **項目記憶**：[.claude/memory/MEMORY.md](../.claude/memory/MEMORY.md)
- **條件規則**：[.claude/rules/](../.claude/rules/)

---

## 💡 最佳實踐

1. **保持簡潔**：每份文檔 < 2000 行。超過了就分割成多個文檔。

2. **內部連結**：使用 markdown 連結連接相關文檔
   ```markdown
   See: [DESIGN-DECISIONS.md](#001-why-fastapi)
   ```

3. **版本號**：主要文檔加上版本號
   ```markdown
   # [PROJECT]-MVP-SPEC v2.1
   ```

4. **最後更新時間**：在文檔底部記錄
   ```markdown
   ---
   最後更新：2026-04-21
   更新者：[名字]
   ```

5. **定期審查**：每個月檢查一次
   - 有過期信息嗎？
   - 有新的決策需要記錄嗎？
   - 有廢棄的文檔可以歸檔嗎？

---

## 📞 需要新增文檔？

1. 在這個 README 中添加入口
2. 複製對應的模板
3. 編輯並提交
4. 更新 `.claude/memory/MEMORY.md` 記錄新增時間

---

**核心理念**：「不在 Git 的知識不存在。」讓所有知識都在這裡。

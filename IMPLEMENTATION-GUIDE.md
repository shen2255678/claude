# Harness Engineering — 完整實施指南

詳細的、逐步的實施流程。如果趕時間，見 [QUICK-START.md](./QUICK-START.md)

---

## 📅 實施時間軸

| 階段 | 時間 | 核心工作 | 預期成果 |
|------|------|--------|--------|
| **Phase 1: 基礎建設** | 1 週 | 建立目錄結構、編制規範文檔 | 系統框架完整 |
| **Phase 2: 規則定義** | 1 週 | 編輯條件化規則、建立檢查清單 | 自動化提醒就位 |
| **Phase 3: 文檔沉澱** | 2-3 週 | 記錄設計決策、演算法版本、部署流程 | 知識庫完整 |
| **Phase 4: 團隊協作** | 3-4 週 | 全隊開始使用、反覆優化 | 高效協作流程 |

**總耗時**：6-8 週

---

## 🏗️ Phase 1: 基礎建設（1 週）

### 1.1 複製倉庫

```bash
git clone https://github.com/shen2255678/claude.git my-ai-project
cd my-ai-project
git remote set-url origin <your-repo-url>
```

### 1.2 驗證目錄結構

```bash
tree -L 2 -a
```

預期輸出：
```
.
├── .claude/
│   ├── memory/
│   ├── rules/
│   └── settings.json
├── docs/
├── examples/
├── .gitignore
├── README.md
├── QUICK-START.md
└── IMPLEMENTATION-GUIDE.md
```

### 1.3 建立 MEMORY.md（項目記憶）

編輯 `.claude/memory/MEMORY.md`：

```markdown
# [你的專案] — 項目記憶

## 當前狀態

### ✅ 完成
- Harness Engineering 系統初始化
- 目錄結構建立
- MEMORY.md 建立

### 🔄 進行中
- 編制規範文檔（SPEC）
- 配置條件化規則

### ⏳ 待做
- 編制設計決策文檔
- 建立演算法版本追蹤
- 配置 CI/CD 和部署流程
- 團隊協作流程設計

## 技術決策

| 決策 | 原因 | 狀態 |
|------|------|------|
| 使用 Harness Engineering | 加速開發、知識沉澱、跨 session 交接 | ✅ 確認 |

## 已知問題

- (無)

## 重要聯繫

- PM: xxx@company.com
- Tech Lead: xxx@company.com

---
建立時間：2026-04-21
最後更新：2026-04-21
```

### 1.4 編制規範文檔

複製 `docs/DESTINY-MVP-SPEC.md` → `docs/[你的專案]-SPEC.md`

編輯新檔案，提供：

**必要部分**：
```markdown
# [你的專案] — MVP 規範 v1.0

## 1. 項目概述

### 1.1 一句話描述
[簡潔描述你的產品/系統]

### 1.2 核心目標
- 目標 1：量化指標（例：支持 10,000 用戶）
- 目標 2：質量指標（例：API 響應 < 500ms）
- 目標 3：業務目標（例：成本降低 30%）

### 1.3 成功定義
當 X、Y、Z 都實現時，才算成功。

## 2. 技術棧

| 層級 | 選擇 | 原因 |
|------|------|------|
| Frontend | Next.js / React / Vue | (列出 3-5 個備選，說明為什麼選這個) |
| Backend | Python FastAPI / Node.js | |
| Database | PostgreSQL / MongoDB | |
| LLM | Claude / GPT / Gemini | |
| Deployment | Vercel / Railway | |

## 3. 架構概覽

```
[ASCII 圖表或文字描述系統組成]

用戶輸入 → 前端 → API → 後端邏輯 → 資料庫 → LLM 調用 → 結果展示
```

## 4. 核心功能清單

### MVP 功能（必做）
- [ ] 功能 1：用戶認證
- [ ] 功能 2：數據輸入
- [ ] 功能 3：AI 推理

### Phase 2 功能（後續）
- [ ] 高級功能 1
- [ ] 高級功能 2

## 5. 資料模型

### User
```
user_id (PK)
email
name
created_at
```

### Request
```
request_id (PK)
user_id (FK)
input_data
status (pending/processing/completed)
created_at
```

## 6. API 端點（初稿）

### 認證
- POST /api/auth/signup
- POST /api/auth/login

### 核心業務
- POST /api/requests (提交請求)
- GET /api/requests/{id} (查詢結果)

## 7. 部署和擴展

### Phase 1（MVP）
- 單個伺服器或 Serverless
- 支持 < 1000 用戶

### Phase 2（擴展）
- 負載均衡
- 多地域部署
- 支持 10,000+ 用戶

## 8. 已知限制

- (列出當前無法做的事情)

---
版本：1.0
作者：[名字]
建立時間：2026-04-21
最後審查：2026-04-21
```

**可選但推薦補充的部分**：
- 用戶故事（User Stories）
- 競品對標
- 風險評估

### 1.5 初次提交

```bash
git add .
git commit -m "chore: initialize Harness Engineering system

[Phase 1: 基礎建設]

- Set up .claude/memory/ for cross-session context management
- Set up .claude/rules/ for conditional rule loading
- Initialize docs/ with MVP specification template
- Create MEMORY.md with project tracking

Features enabled:
✓ New team member onboarding in 1 day
✓ Cross-session handoff in 5 minutes  
✓ Complete decision traceability
✓ 50%+ faster delivery cycle

Next: Define conditional rules and document design decisions"

git push -u origin main
```

---

## 🎯 Phase 2: 規則定義（1 週）

### 2.1 根據技術棧編輯規則

刪除不相關的規則：

```bash
# 如果不用 Supabase
rm .claude/rules/supabase.md

# 如果不用機器學習權重調整
rm .claude/rules/weights-tuning.md

# 保留的規則
ls .claude/rules/
# docs-first.md
# astro-service.md (如果用 Python)
# frontend.md (如果用 Next.js)
# api-security.md (安全相關)
# shared-modules.md (多個子系統)
# verify-impact.md (跨服務驗證)
```

### 2.2 自訂 docs-first.md

編輯 `.claude/rules/docs-first.md`：

```markdown
# Rule: 實作前必讀文檔

## 原則
實作任何功能前，必須在相應文檔中有明確定義。

## 檢查清單

- [ ] 功能在 MVP-SPEC.md 的核心功能列表中
- [ ] 在 DESIGN-DECISIONS.md 中有設計說明（為什麼這樣做）
- [ ] 相關的 API endpoint 在文檔中定義了
- [ ] 相關的資料模型在文檔中定義了

## 例外情況

### 允許不寫文檔直接實作
- Bug 修復（但要更新 CHANGELOG）
- 重構（不改功能）
- 文檔本身的修改

### 不允許
- 新 API endpoint 沒有定義
- 新資料表沒有說明用途
- 複雜的業務邏輯沒有解釋「為什麼」

## 完成後

實作完成後，更新文檔：
- [ ] MEMORY.md：記錄完成時間
- [ ] ALGORITHM-CHANGELOG.md：如果修改了算法
- [ ] DESIGN-DECISIONS.md：如果有新的設計決策
- [ ] 相應的指南文檔（API、Deployment 等）
```

### 2.3 自訂 astro-service.md（如果用 Python/FastAPI）

編輯 `.claude/rules/astro-service.md`：

```markdown
# Rule: Python FastAPI 後端服務

## 適用情況
編輯 `backend/services/` 或 `app/*.py` 時自動加載

## 檢查清單

### 代碼結構
- [ ] 新函數有 type hints（例：def get_user(id: int) -> User）
- [ ] 新端點有 docstring
- [ ] 新 endpoint 在 API 文檔中有定義

### 錯誤處理
- [ ] 捕獲所有可能的異常
- [ ] 返回適當的 HTTP status code（400, 404, 500）
- [ ] 錯誤訊息清晰且有幫助

### 資料庫
- [ ] 所有資料庫操作都有錯誤處理
- [ ] 複雜查詢都有 SQL 註解說明邏輯
- [ ] 新 schema 變更都在遷移文件中

### 測試
- [ ] 新 endpoint 有至少 3 個測試用例
  - Happy path（正常情況）
  - Error path（錯誤情況）
  - Edge case（邊界情況）

### 安全
- [ ] 檢查 API endpoint 的認證和授權
- [ ] 檢查 SQL injection 風險
- [ ] 敏感數據（密碼、token）不要 log

### 文檔
- [ ] API 文檔已更新（基於代碼的 docstring）
- [ ] ALGORITHM.md 已更新（如果改動了業務邏輯）
- [ ] 複雜邏輯有代碼註解

## 性能檢查清單
- [ ] 新 endpoint 的響應時間 < 2 秒
- [ ] 如果用了複雜查詢，有 index 優化
- [ ] 沒有 N+1 查詢問題

## 提交前

```bash
# 執行檢查
python -m pytest backend/            # 單元測試
black backend/                       # 代碼格式
mypy backend/                        # 類型檢查

# 確認無誤再提交
```

## 例外情況

- Bug 修復可以先改後文檔
- Performance hotfix 可以先改後優化
```

### 2.4 自訂 frontend.md（如果用 Next.js）

類似的方式定義前端規則，包括：
- React component 結構
- TypeScript 檢查
- 測試要求（Vitest/Playwright）
- 無障礙（Accessibility）要求
- 性能指標（Lighthouse 分數）

### 2.5 自訂 api-security.md

```markdown
# Rule: API 安全檢查清單

## 認證和授權
- [ ] 每個 API endpoint 都檢查用戶是否登入
- [ ] 用戶只能訪問自己的資料
- [ ] Admin 操作需要特別驗證

## 資料驗證
- [ ] 所有用戶輸入都驗證（類型、長度、格式）
- [ ] 拒絕異常的請求

## 日誌和監控
- [ ] 記錄所有認證嘗試（成功和失敗）
- [ ] 記錄所有 Admin 操作
- [ ] 敏感操作（刪除）有額外日誌

## API 金鑰管理
- [ ] API key 存儲在 .env（不提交到 git）
- [ ] 定期輪換 key
- [ ] 不同環境用不同 key

## 速率限制（Rate Limiting）
- [ ] 防止 API 濫用
- [ ] 合理的限制（例：1000 req/hour）
```

### 2.6 第二次提交

```bash
git add .claude/rules/ .claude/memory/
git commit -m "chore: configure conditional rules based on tech stack

[Phase 2: 規則定義]

Define conditional loading rules for:
✓ docs-first.md - Documentation before implementation
✓ astro-service.md - Python/FastAPI conventions
✓ frontend.md - Next.js/React component patterns  
✓ api-security.md - Security checklist

Remove unrelated rules:
✗ supabase.md (not using Supabase)
✗ weights-tuning.md (no ML models)

Each rule includes:
- Applicable conditions (when to load)
- Pre-implementation checklist
- Post-implementation verification
- Common pitfalls and exceptions

Next: Document design decisions and deployment flow"

git push
```

---

## 📚 Phase 3: 文檔沉澱（2-3 週）

### 3.1 建立 DESIGN-DECISIONS.md

記錄每個重要決策的「為什麼」：

```markdown
# 設計決策記錄

## 001: 選擇 FastAPI 而不是 Django

**決策者**：[你的名字]  
**決策時間**：2026-04-21  
**相關 Issue**：xxx  

### 背景
我們需要一個後端框架來支持 XXX 功能

### 考慮的選擇
1. Django + Django REST Framework
2. FastAPI
3. Starlette

### 決策
**選擇：FastAPI**

### 理由
- 自動生成 API 文檔（Swagger/OpenAPI）
- 異步支持（async/await），性能更好
- 更簡潔的代碼（vs. Django）
- 適合微服務架構

### 折衷
- Django 有更成熟的 ORM（SQLAlchemy 需要自己配置）
- Django 有更多第三方包

### 後續影響
- 所有後端服務使用 FastAPI
- 資料庫操作用 SQLAlchemy ORM
- 驗證用 Pydantic

---

## 002: PostgreSQL + pgvector for 向量搜索

**決策者**：[你的名字]  
**決策時間**：2026-04-21  

### 背景
需要存儲和搜索 Embedding 向量

### 考慮的選擇
1. PostgreSQL + pgvector extension
2. Pinecone（向量數據庫）
3. Milvus（開源向量DB）

### 決策
**選擇：PostgreSQL + pgvector**

### 理由
- 減少依賴（只用一個數據庫）
- pgvector 性能足夠（< 100k 向量）
- 成本更低

### 折衷
- 超過 100 萬向量後性能會下降
- 向量操作不如專用向量 DB 優化

### 遷移計畫
- Phase 1（< 100k）：pgvector
- Phase 2（> 100k）：考慮遷移到 Pinecone

---

## 003: Claude Code + Harness Engineering for 開發協作

...（更多決策）
```

### 3.2 建立 ALGORITHM.md 和 CHANGELOG

如果有複雜的業務邏輯或算法：

`docs/ALGORITHM.md`：
```markdown
# 演算法設計 — 版本歷史

## 當前版本：v2.3

### 核心邏輯
[詳細說明你的算法、公式、決策樹等]

## 版本歷史

### v2.3 (2026-05-15)
- 改進：使用 multi-head attention 提高推薦准確度
- 修復：Bug in weight normalization
- 性能：推理速度提升 20%

### v2.2 (2026-05-01)
- 改進：添加用戶偏好權重
- 修復：Edge case when no data available

### v2.1 (2026-04-21)
- 初始版本
```

`docs/ALGORITHM-CHANGELOG.md`：
```markdown
# 演算法變更日誌 — 按時間順序

## 2026-05-15
**版本**：v2.3  
**改動**：Multi-head attention 實現  
**代碼**：backend/algorithm/attention.py  
**原因**：提高推薦准確度（新增 20% 數據需要改進）  
**影響**：新模型訓練需要 2 小時（舊版本 1 小時）  
**驗證**：在測試集上準確度從 82% → 87%  

## 2026-05-01
**版本**：v2.2  
**改動**：用戶偏好權重公式  
**原因**：A/B 測試顯示考慮用戶偏好後滿意度提升 15%  

...
```

### 3.3 建立 DEPLOYMENT.md

部署流程和檢查清單：

```markdown
# 部署指南 — v3.3

## 環境和工具
- Vercel（前端部署）
- Railway（後端部署）
- GitHub Actions（CI/CD）

## 部署流程

### 前置檢查
```bash
# 測試
npm run test          # 前端測試
python -m pytest      # 後端測試

# 代碼品質
npm run lint          # 前端 lint
black .               # Python 格式檢查
mypy .                # 類型檢查
```

### 部署步驟

**1. 部署到 staging（預發佈環境）**

```bash
# 自動觸發（當 git push 到 develop 分支時）
# GitHub Actions 會：
# - 運行測試
# - 部署到 staging
# - 執行煙霧測試（Smoke test）
```

**2. 驗證 staging**
```bash
# 檢查清單
- [ ] 前端能加載
- [ ] 登入功能正常
- [ ] 核心業務流程能完成
- [ ] 無明顯錯誤日誌
```

**3. 部署到生產環境**
```bash
# 手動操作
git tag v1.2.3
git push --tags

# 或在 GitHub releases 中點擊「Publish」

# 部署流程：
# - 後端自動部署到 Railway
# - 前端自動部署到 Vercel
# - CDN 快取刷新
# - 監控指標上報
```

### 回滾步驟

如果出現問題：
```bash
# 回滾到前一個版本
git revert <commit-hash>
git push
# 自動觸發部署
```

### 監控和告警

部署後檢查：
- 錯誤率（< 0.5%）
- API 響應時間（< 500ms）
- 資源使用（CPU < 70%, Memory < 80%）

如果異常，立即回滾。

---
版本：3.3
最後更新：2026-05-15
```

### 3.4 建立 TESTING-GUIDE.md

測試策略和檢查清單：

```markdown
# 測試指南

## 測試金字塔

```
         /\
        /E2E\         端到端測試（用戶流程）
       /------\
      /整合測試\     多個模組協作
     /----------\
    /單元測試    \   單個函數/組件
   /________________\
```

## 單元測試

### 前端（Vitest + React Testing Library）

```javascript
describe('UserForm', () => {
  it('should submit valid data', () => {
    // Arrange
    render(<UserForm onSubmit={mockSubmit} />);
    
    // Act
    fireEvent.change(screen.getByLabelText('Email'), 
      { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Submit'));
    
    // Assert
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

### 後端（Pytest）

```python
def test_create_user_with_valid_data():
    # Arrange
    user_data = {"email": "test@example.com", "name": "John"}
    
    # Act
    response = client.post("/api/users", json=user_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
```

## 整合測試

測試 API + 資料庫的協作：
```python
def test_user_login_flow():
    # 1. 註冊
    register_response = client.post("/api/auth/signup", json={...})
    
    # 2. 登入
    login_response = client.post("/api/auth/login", json={...})
    
    # 3. 驗證 token
    assert login_response.json()["token"] is not None
```

## 端到端測試（E2E）

使用 Playwright：
```javascript
test('user can complete matching flow', async ({ page }) => {
  // 1. 訪問網站
  await page.goto('https://destinyanddestiny.com');
  
  // 2. 登入
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button:has-text("Login")');
  
  // 3. 完成匹配
  await page.click('button:has-text("Start Matching")');
  await page.selectOption('select[name="gender"]', 'male');
  await page.click('button:has-text("Submit")');
  
  // 4. 驗證結果
  await expect(page).toHaveURL(/.*results/);
});
```

## 測試覆蓋率目標

| 部分 | 目標 | 檢查方法 |
|------|------|--------|
| 單元測試 | > 80% | `coverage run -m pytest` |
| 整合測試 | > 60% | 關鍵業務流程 |
| E2E 測試 | 100% | 用戶關鍵路徑 |

...
```

### 3.5 更新 MEMORY.md

記錄 Phase 3 的完成：

```markdown
### ✅ 完成
- Harness Engineering 系統初始化
- 條件化規則配置
- 規範文檔編制
- 設計決策記錄（20+）
- 演算法版本管理
- 部署和測試指南

### 🔄 進行中
- 團隊協作流程優化

### ⏳ 待做
- (無重大任務)
```

### 3.6 第三次提交

```bash
git add docs/ .claude/memory/
git commit -m "docs: complete core documentation set

[Phase 3: 文檔沉澱]

Add comprehensive documentation:
✓ docs/DESIGN-DECISIONS.md - 20+ architectural decisions
✓ docs/ALGORITHM.md - v2.3 with version history
✓ docs/ALGORITHM-CHANGELOG.md - timeline of changes
✓ docs/DEPLOYMENT.md - step-by-step deployment guide
✓ docs/TESTING-GUIDE.md - testing pyramid and strategies
✓ docs/PROMPT-GUIDE.md - LLM prompt engineering

Documentation enables:
✓ New team members understand system in 1 day
✓ Complete decision traceability
✓ Confident deployment procedures
✓ Test coverage > 80%

Knowledge is now permanently captured in git"

git push
```

---

## 👥 Phase 4: 團隊協作（3-4 週）

### 4.1 向全隊介紹系統（1 天）

準備一個 30 分鐘的簡報：

**內容**：
1. Harness Engineering 系統概覽（5 分鐘）
2. 日常工作流程演示（10 分鐘）
3. 常見問題 Q&A（10 分鐘）
4. 團隊反饋收集（5 分鐘）

**演示內容**：
```
1. 開始工作
   - 讀 .claude/memory/MEMORY.md
   - 檢查當前任務是什麼

2. 編輯代碼
   - 系統自動加載相關規則
   - 檢查清單出現在提示中

3. 完成工作
   - 更新 MEMORY.md
   - Commit with detailed message

4. 知識沉澱
   - 新發現的最佳實踐記錄在 DESIGN-DECISIONS
   - 性能改進記錄在 CHANGELOG
```

### 4.2 收集反饋和優化（2-3 週）

**第 1 週**：
- 全隊開始使用系統
- 每天記錄遇到的問題
- 每週一 30 分鐘同步會議

**第 2 週**：
- 迭代改進規則和文檔
- 新增常見問題到 FAQs
- 優化 MEMORY.md 的模板

**第 3 週**：
- 衡量效果（見下方指標）
- 最後的調整
- 系統穩定

### 4.3 衡量成效

**定量指標**：

```bash
# 新人上手時間
- 目標：1 天
- 實測：(記錄新人花費時間)

# Session 交接時間
- 目標：5 分鐘
- 實測：(記錄交接實際時間)

# 代碼審查輪次
- 目標：平均 1 輪（有檢查清單）
- 實測：(統計平均輪次)

# Bug 回報率
- 目標：< 5%
- 實測：(統計遺漏問題)
```

**定性反饋**：
- 「系統有幫助嗎？」- 收集意見
- 「哪些規則最有用？」- 優化方向
- 「缺少什麼？」- 新增文檔

### 4.4 最終總結提交

```bash
git add . && git commit -m "chore: complete Harness Engineering implementation

[Phase 4: 團隊協作完成]

System Metrics After 4 Weeks:
✓ New team member onboarding: 1 day (target: 1 day)
✓ Cross-session handoff: 5-7 minutes (target: 5 min)
✓ Code review cycles: 1.2 rounds (target: 1)
✓ Undocumented decisions: 0% (target: 0%)
✓ Delivery cycle improvement: 48% (target: 50%+)

Core Benefits Realized:
✓ Knowledge never lost to team turnover
✓ Architecture decisions permanently traceable  
✓ Automated compliance with project standards
✓ Reduced context switching costs
✓ 50% faster feature delivery cycle

Ready for: Team scaling, parallel project work, long-term maintenance

Next: Monitor, iterate, and expand to other teams"

git push
```

---

## 📊 完整時間軸總結

```
Week 1-2: Phase 1 (基礎建設)
  ✓ 目錄結構就位
  ✓ SPEC 文檔編制
  
Week 3-4: Phase 2 (規則定義)
  ✓ 條件化規則配置
  ✓ 檢查清單完整
  
Week 5-7: Phase 3 (文檔沉澱)
  ✓ 設計決策記錄
  ✓ 部署和測試指南
  ✓ 12+ 核心文檔完整
  
Week 8+: Phase 4 (團隊協作)
  ✓ 全隊開始使用
  ✓ 效果驗證和優化
  ✓ 系統穩定運行

目標：6-8 週完整實施，獲得 50%+ 的開發周期改善
```

---

## 🆘 常見問題

**Q: 我們已經有一個在線系統，能應用這個嗎？**  
A: 可以。直接在現有項目中創建 `.claude/`、`docs/`，然後：
1. 讀取現有代碼和架構
2. 寫成 SPEC 和 DESIGN-DECISIONS
3. 定義規則
4. 開始使用

舊系統的知識沉澱可能需要額外 1-2 週。

**Q: 團隊 10+ 人，怎麼快速推行？**  
A: 
1. 選 3-5 個 core team 先用（1 週）
2. 他們提供反饋（1 週）
3. 修改後向全隊推行（1 週）

同時讓其他人準備文檔（可平行進行）。

**Q: 用了這個系統還需要 Confluence/Notion 嗎？**  
A: 
- 內部技術文檔：全部在 git（Harness）
- 對外文檔（用戶手冊）：可以放 Confluence/Notion
- 項目管理（Jira）：保留
- 團隊 Wiki：可以用 GitHub Wiki

git 是 source of truth，其他工具是輔助。

---

**祝實施順利！** 🚀

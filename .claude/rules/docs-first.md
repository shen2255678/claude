# Rule: 實作前必讀文檔 (Docs First)

## 原則

**實作任何新功能前，必須在相應文檔中有清晰定義。**

不是「想到什麼就寫什麼」，而是「規劃好再寫」。

---

## ✅ 實作前檢查清單

在開始寫代碼前：

- [ ] 功能已在 `docs/[PROJECT]-SPEC.md` 中定義
- [ ] 相關 API endpoint 已設計並文檔化
- [ ] 資料模型（table/schema）已設計
- [ ] 如果有複雜邏輯，已在 `docs/ALGORITHM.md` 中說明
- [ ] 在 `docs/DESIGN-DECISIONS.md` 中有「為什麼這樣做」的記錄
- [ ] 知道這個功能的測試策略（測試哪些情況）

## ⚠️ 常見違反

❌ **錯誤做法 1**：直接改代碼，事後補文檔
```
開發者：「先寫代碼，之後再寫文檔」
→ 結果：通常「之後」永遠不會來，文檔一直不完整
```

❌ **錯誤做法 2**：改了 API 但沒更新文檔
```
開發者修改 POST /api/users 的參數
→ 沒有更新 docs/API.md
→ 新人根據文檔調用 API 失敗
```

❌ **錯誤做法 3**：修改資料庫 schema 但沒記錄原因
```
開發者：「將 user 表的 email 從 VARCHAR(100) 改成 VARCHAR(255)」
→ 沒有在 DESIGN-DECISIONS 中說明為什麼
→ 3 個月後，沒人知道為什麼要這樣改
```

## ✅ 正確做法

### 場景 1：新增 API Endpoint

**Step 1：設計（文檔）**
編輯 `docs/DESTINY-MVP-SPEC.md` 或 `docs/ASTRO-SERVICE.md`：

```markdown
### POST /api/users/{id}/match

**功能**：提交匹配請求

**請求**：
```json
{
  "target_id": int,
  "system": "western" | "vedic" | "bazi"
}
```

**回應**：
```json
{
  "match_id": string,
  "score": float (0-100),
  "status": "pending" | "completed"
}
```

**錯誤情況**：
- 400: user_id 不存在
- 400: system 不合法
- 429: 請求過於頻繁
```

**Step 2：在 DESIGN-DECISIONS 中說明為什麼**
```markdown
## 003: Separate match endpoint rather than merge with GET user

**決策**：POST /api/users/{id}/match (獨立 endpoint)
而不是 GET /api/users/{id}?action=match (複用 endpoint)

**原因**：
- 語義清晰（POST 表示「動作」，符合 REST 慣例）
- 便於速率限制（可對 /match 做特殊限制）
- 便於審計日誌（追蹤誰提交了哪些匹配請求）

**折衷**：多了一個 endpoint
```

**Step 3：寫代碼**
```python
@router.post("/users/{id}/match")
async def create_match(
    id: int,
    request: MatchRequest,
    current_user: User = Depends(get_current_user)
):
    """
    See: docs/ASTRO-SERVICE.md#POST-/users/{id}/match
    Design decision: docs/DESIGN-DECISIONS.md#003
    """
    ...
```

**Step 4：寫測試**
```python
def test_create_match_with_valid_data():
    # Arrange: See docs/TESTING-GUIDE.md
    response = client.post(
        f"/api/users/1/match",
        json={"target_id": 2, "system": "western"},
        headers={"Authorization": "Bearer token"}
    )
    
    # Assert
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
```

**Step 5：更新 MEMORY.md**
```markdown
### ✅ 完成
- POST /api/users/{id}/match endpoint
  - 設計文檔：docs/ASTRO-SERVICE.md
  - 決策說明：docs/DESIGN-DECISIONS.md#003
  - 測試覆蓋：happy path + error cases
```

---

### 場景 2：修改資料庫 Schema

**Step 1：在 DESIGN-DECISIONS 記錄原因**
```markdown
## 004: Add user_preferences table

**決策**：新增 user_preferences 表，而不是在 user 表中添加列

**原因**：
- 用戶偏好數據經常變化，user 表相對穩定
- 便於擴展（未來可能有更多偏好字段）
- 便於查詢（可以快速檢索所有偏好變更）

**Schema**：
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user(id),
  astrology_system VARCHAR(50),
  language VARCHAR(10),
  updated_at TIMESTAMP,
  UNIQUE(user_id, astrology_system)
);
```
```

**Step 2：建立 Migration 文件**
```python
# migrations/versions/0005_add_user_preferences.py
"""Add user_preferences table

Revision ID: 0005
Create Date: 2026-04-22
"""

def upgrade():
    op.create_table(
        'user_preferences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        ...
    )

def downgrade():
    op.drop_table('user_preferences')
```

**Step 3：更新 ORM Model**
```python
# models.py
class UserPreference(Base):
    """
    See: docs/DESIGN-DECISIONS.md#004
    
    Stores user preferences for astrology systems and language.
    """
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    astrology_system = Column(String(50))
    ...
```

---

## 📋 完成後檢查清單

實作完成後，在提交前確認：

- [ ] 文檔已更新（新 endpoint、新 table、新算法）
- [ ] DESIGN-DECISIONS 記錄了「為什麼這樣做」
- [ ] 有測試（happy path + error cases）
- [ ] MEMORY.md 記錄了完成時間
- [ ] commit message 參照了文檔位置

**Commit Message 範例**：
```
feat: add POST /api/users/{id}/match endpoint

Implements the matching request feature as per:
- docs/DESTINY-MVP-SPEC.md#Core Features
- docs/ASTRO-SERVICE.md#POST /users/{id}/match

Design decision: docs/DESIGN-DECISIONS.md#003
Why separate endpoint instead of query parameter

Tests:
✓ test_create_match_with_valid_data
✓ test_create_match_with_invalid_system
✓ test_create_match_unauthorized

Closes #123
```
```

---

## 🚨 例外情況（何時可以不寫文檔）

### 允許先改後文檔
1. **Bug 修復**
   ```
   Bug：API 返回 500 而不是 400
   修復：改代碼
   文檔：之後更新 CHANGELOG
   ```

2. **小改進**（不改 API、不改 DB schema）
   ```
   例：優化一個查詢的性能（從 1 秒改到 0.5 秒）
   文檔要求：在 PERFORMANCE.md 記錄
   ```

3. **重構**（不改功能，只改代碼結構）
   ```
   例：把一個大函數分成多個小函數
   文檔要求：無（功能不變）
   ```

### 嚴禁不文檔的改動
1. ❌ **新 API endpoint** — 必須先設計
2. ❌ **新資料表** — 必須先設計
3. ❌ **改 API 參數** — 必須更新文檔
4. ❌ **複雜的業務邏輯** — 必須說明為什麼

---

## 🤔 如何判斷「需不需要文檔」

**用這個決策樹**：

```
這個改動是否改變了外部接口？
  ├─ 是（新 API、改 API、新 table、改 table）
  │  └─ 必須先文檔化
  │
  └─ 否（內部重構、性能改進）
     └─ 看復雜度
        ├─ 簡單（< 50 行代碼）
        │  └─ 可以先改後記錄
        │
        └─ 複雜（> 50 行，涉及多個模組）
           └─ 建議先設計後實現
```

---

## 📝 模板

創建新功能時，複製這個模板到相應文檔：

```markdown
## [功能名稱]

**功能描述**：一句話說明做什麼

**API 設計**：
- Endpoint：METHOD /path
- 輸入參數：(列出)
- 輸出參數：(列出)
- 錯誤情況：(列出)

**資料模型**：
- 相關 table：(列出)
- 新建 table：(如有)

**複雜度**：
- 預計代碼行數：
- 涉及模組數：
- 測試用例數：

**為什麼這樣設計**：
(連結到 DESIGN-DECISIONS)

**相關規則**：
- See .claude/rules/docs-first.md
- See docs/TESTING-GUIDE.md
```

---

## 💬 需要幫助？

如果不確定「要不要寫文檔」，問自己：

- 「6 個月後，新人會理解這個為什麼存在嗎？」
  - 是 → 不用文檔
  - 否 → 寫文檔

- 「這個改動會影響別人的代碼嗎？」
  - 是 → 寫文檔（告訴他們改動了什麼）
  - 否 → 看情況

---

**核心理念**：文檔不是負擔，是投資。投資 30 分鐘寫文檔，節省 10 人次的 30 分鐘理解時間。

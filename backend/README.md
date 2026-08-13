# Arcana by H.O.S - Local Mock API Backend

This is a development-only FastAPI local mock backend for **Arcana by H.O.S**.
It exposes HTTP JSON endpoints for Free/Premium Reading, Symbolic Lucky Numbers, and Digital Talisman metadata.

> **Security Note**: This local mock API is for local development only and must not be exposed directly to the public internet.

---

## 🚀 How to Run Locally

### 1. Create and Activate Virtual Environment (PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Start Development Server

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **OpenAPI JSON**: `http://127.0.0.1:8000/openapi.json`
- **Health Check**: `GET http://127.0.0.1:8000/api/health`

---

## 📡 API JSON Contracts

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response (200 OK)**:
```json
{
  "status": "ok",
  "service": "arcana-local-mock-api",
  "version": "0.1.0"
}
```

### 2. Free 1-Card Reading
- **Endpoint**: `POST /api/readings/free`
- **Request Example**:
```json
{
  "entryType": "CONCERN",
  "storyText": "회사를 계속 다녀야 할지 고민입니다.",
  "ritualType": "reflection",
  "selectedCardId": "the_sun",
  "language": "ko"
}
```
- **Response Example (200 OK)**:
```json
{
  "readingId": "free_1715000000000",
  "selectedCardId": "the_sun",
  "headline": "✦ XIX. 태양 · 명료함과 활력의 상징",
  "currentSituation": "당신이 보여준 상황과 'XIX. 태양' 카드가 만나 현재 마음의 템포를 차분히 비추어줍니다.",
  "possibility": "성급하게 답을 내리기보다, 상황이 자연스럽게 자리 잡도록 잠시 시선을 정돈해보세요.",
  "signals": "내면에서 조용히 들려오는 첫 번째 직관과 마음에 남아 있는 작은 호기심.",
  "action": "오늘 하루는 스스로에게 부담을 주지 말고, 가장 편안한 마음에 집중해보세요.",
  "talismanMessage": "조용한 순간 속에 당신이 찾던 명료함이 담겨 있습니다.",
  "disclaimer": "본 리딩은 개인적 성찰과 엔터테인먼트를 위한 조언이며 미래를 결정하지 않습니다."
}
```

### 3. Premium 3-Card Deep Reading
- **Endpoint**: `POST /api/readings/premium`
- **Request Example**:
```json
{
  "entryType": "WISH",
  "storyText": "올해 준비해온 프로젝트의 좋은 마무리를 바라고 있습니다.",
  "ritualType": "blessing",
  "cardIds": ["the_chariot", "the_moon", "the_star"],
  "language": "ko"
}
```

### 4. Symbolic Lucky Numbers
- **Endpoint**: `POST /api/numbers/symbolic`
- **Request Example**:
```json
{
  "gameType": "kr_lotto_645",
  "entryType": "DREAM",
  "storyText": "황금빛 호수를 건너는 꿈을 꾸었습니다.",
  "ritualType": "blessing",
  "freeCardId": "the_star"
}
```

### 5. Personalized Digital Talisman
- **Endpoint**: `POST /api/talismans/options`
- **Request Example**:
```json
{
  "entryType": "UNEASY",
  "storyText": "마음이 다소 불안하고 정리되지 않습니다.",
  "ritualType": "release",
  "freeCardId": "the_moon",
  "language": "ko"
}
```

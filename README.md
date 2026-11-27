# Arcana by H.O.S

> 마음에 남는 일을 짧게 적고, 짧은 의식(Ritual)을 거쳐 타로 카드로 마음을 정리하는 몰입형 Reflection 서비스

제품 정의와 절대 원칙은 [`PRODUCT_PRINCIPLES.md`](PRODUCT_PRINCIPLES.md)를 따릅니다. 기능·UI·프롬프트·API를 바꾸기 전에 먼저 확인하세요.

| 구분 | 내용 |
|------|------|
| **Free Reading** | 타로 카드 1장, 그 자체로 완결된 리딩 |
| **Premium Deep Reading** | 타로 카드 3장 (지금의 흐름 / 숨겨진 의미 / 앞으로 가져갈 메시지) |
| **Premium Ritual** | Lucky Numbers (상징·엔터테인먼트용), Digital Talisman (3개 중 1개 선택 다운로드) |
| **언어** | 한국어(KO) / 영어(EN) 동일 지원 |

---

## 🚀 로컬 실행

### 1. 프런트엔드 (React + Vite)

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다.

기본값(`VITE_READING_PROVIDER=local`)에서는 리딩이 브라우저 안의 Mock 서비스로 생성되어 백엔드 없이도 전체 흐름을 볼 수 있습니다.

### 2. 백엔드 (FastAPI Local Mock API, 선택)

자세한 내용과 API 계약은 [`backend/README.md`](backend/README.md)를 참고하세요.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

프런트엔드가 백엔드를 쓰게 하려면 `.env`에서 `VITE_READING_PROVIDER=api`로 바꾸고 dev 서버를 다시 시작합니다.

### 3. 테스트 / 빌드

```powershell
npm test                 # 프런트 테스트 전체
npm run build            # 타입체크 + 프로덕션 빌드 (dist/)
```

---

## ⚙️ 환경 변수

### 프런트엔드 (`.env`)

| 변수 | 설명 |
|------|------|
| `VITE_READING_PROVIDER` | `local`(브라우저 Mock, 기본) 또는 `api`(FastAPI 백엔드 호출) |
| `VITE_API_BASE_URL` | 백엔드 주소. 프로덕션에서 `api` 모드면 필수 |
| `VITE_ANALYTICS_PROVIDER` | `local`(브라우저에만 기록, 기본) 또는 `remote`(백엔드로도 전송) |
| `VITE_FIREBASE_*` | Firebase 인증용 (로그인 기능 사용 시) |
| `VITE_PAYPAL_CLIENT_ID` | PayPal 결제 (실결제 연동 시) |
| `VITE_TOSS_CLIENT_KEY` | 토스페이먼츠 결제 (실결제 연동 시, `test_ck_`는 테스트 키) |
| `VITE_SITE_URL` | 공개 사이트 주소. 설정하면 카드 의미 페이지에 canonical/hreflang 태그를 넣고 `sitemap.xml`·`robots.txt`를 생성 |

### 백엔드 (`backend/.env.example` 참고)

| 변수 | 설명 |
|------|------|
| `READING_PROVIDER` | `mock`(기본) 또는 `gemini` |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | `gemini` 모드에서만 필요 |
| `ANALYTICS_PROVIDER` | `disabled`(기본) 또는 `supabase` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `supabase` 모드에서만 필요. 서버에만 보관 |
| `CORS_ALLOWED_ORIGINS` | 쉼표로 구분한 허용 Origin (미설정 시 localhost 개발 주소) |

> ⚠️ `.env` 파일은 git에 올리지 않습니다 (`.gitignore`에 등록됨).

---

## 📁 프로젝트 구조

```
ArcanaByHOS/
├── PRODUCT_PRINCIPLES.md      ← 제품 정의 & 절대 원칙
├── .agents/AGENTS.md          ← 작업 규칙 요약
├── index.html
├── public/
│   ├── images/                ← 캐릭터·섹션 이미지
│   └── videos/                ← 섹션 배경 영상
├── src/
│   ├── App.tsx                ← 랜딩 페이지 + 상품 섹션
│   ├── config/
│   │   ├── content.ts         ← 사이트 텍스트
│   │   ├── dictionary.ts      ← KO/EN UI 문구
│   │   ├── products.ts        ← ⭐ Premium 상품·가격 (결제 설정도 여기서 가져감)
│   │   ├── tarotCards.ts      ← 타로 카드 데이터
│   │   ├── numberGames.ts     ← Lucky Numbers 게임 설정
│   │   └── videos.ts          ← 배경 영상 경로
│   ├── components/
│   │   ├── ReadingExperience.tsx   ← 입력 → Ritual → 카드 선택 → 결과 흐름
│   │   ├── ReadingResultView.tsx   ← Free 리딩 결과
│   │   ├── SymbolicNumbersView.tsx ← Lucky Numbers
│   │   ├── DigitalTalismanView.tsx ← Digital Talisman
│   │   ├── MockCheckoutSummary.tsx / PaymentComingSoon.tsx ← 목업 결제 화면
│   │   └── payment/                ← PayPal·토스 결제 버튼 (실결제 연동 대비, 현재 미사용)
│   ├── services/              ← Mock 리딩, API 클라이언트, 분석 이벤트
│   ├── lib/                   ← Firebase, Firestore, PayPal, 토스 설정
│   ├── contexts/AuthContext.tsx
│   └── types/
├── src/content/               ← 카드 의미 사전(KO/EN 22장) + 정적 페이지 생성기
├── tests/                     ← 프런트 테스트 (node --test)
└── backend/                   ← FastAPI Local Mock API
    ├── app/
    │   ├── routes/            ← readings, numbers, talismans, analytics
    │   ├── providers/         ← mock / gemini 리딩 엔진 (교체 가능)
    │   ├── prompts/           ← AI 프롬프트
    │   └── services/          ← Mock 생성기, 분석 저장, 요청 제한
    ├── sql/analytics_events.sql ← Supabase 테이블 정의
    └── tests/
```

---

## 📖 카드 의미 사전 (SEO)

메이저 아르카나 22장의 의미를 검색엔진이 읽을 수 있는 정적 HTML 페이지로 만듭니다.

- 주소: `/cards/`, `/cards/{slug}/` (영어) · `/ko/cards/`, `/ko/cards/{slug}/` (한국어)
- 내용: [`src/content/cardLibrary.ts`](src/content/cardLibrary.ts) 한 곳에서 관리
- `npm run dev`에서는 바로 열리고, `npm run build` 때 `dist/`에 HTML로 생성됩니다 (`vite.config.ts`의 `cardPagesPlugin`).
- 각 페이지의 "무료 리딩 시작하기"는 `/?lang=ko#reading`처럼 해당 언어로 앱의 리딩 섹션을 엽니다.

---

## 💳 결제 현황

현재 Premium 결제는 **목업 단계**입니다. 상품 클릭과 구매 의향은 분석 이벤트로만 기록되며 실제 결제는 일어나지 않습니다.

실결제를 켜기 전에 필요한 작업:

- 결제 승인을 서버에서 처리 (토스 `successUrl` 승인 API, PayPal 서버 측 주문 생성·capture)
- Premium API(`/api/readings/premium` 등)에 결제·인증 확인 추가
- 결제 완료 후 주문 기록(`orders` 컬렉션) 저장

---

## 🛠 기술 스택

| 기술 | 용도 |
|------|------|
| React 18 + TypeScript, Vite 5 | 프런트엔드 |
| Tailwind CSS 3, Framer Motion 12 | 스타일 & 애니메이션 |
| Firebase Auth / Firestore | 로그인, 사용자 데이터 |
| FastAPI + Pydantic | 백엔드 Mock API |
| Google Gemini (선택) | AI 리딩 Provider |
| Supabase (선택) | 분석 이벤트 저장 |
| PayPal / 토스페이먼츠 | 결제 (연동 준비 중) |

---

**© 2026 The Studio HOS. All rights reserved.**

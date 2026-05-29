# KOSPI Financial Compare AI

**KOSPI 상장기업 재무 비교 분석기** — Wall Street Journal 스타일의 AI 기반 기업 비교 분석 플랫폼

[OPENDART](https://opendart.fss.or.kr/) 재무 데이터와 OpenAI GPT를 결합해, 초급 투자자·재무분석 학습자도 이해하기 쉬운 **전문 애널리스트 수준의 비교 리포트**를 생성합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **기업 검색** | KOSPI 대표 종목 이름·종목코드로 검색 |
| **기업 비교** | 최대 2개 기업 선택 후 원클릭 비교 |
| **재무 시각화** | Summary Card, 비교 표, Bar Chart, Radar Chart |
| **AI 투자 인사이트** | GPT 기반 강점·약점·투자 고려사항 (WSJ 톤) |

### 비교·분석 항목

- **기본 정보**: 기업명, 종목코드, 업종, 설립일 (DART 기업개황)
- **재무 지표**: 매출액, 영업이익, 당기순이익, 총자산, 총부채, 자본총계, 영업현금흐름
- **재무 비율**: ROE, ROA, 영업이익률, 부채비율, 유동비율, 매출·영업이익 성장률, FCF(근사)
- **레이더 차트**: 수익성 · 성장성 · 안정성 · 현금흐름 4축 종합 점수

### 데이터 기준

- **연결재무제표** (`CFS`)
- **사업보고서** (`reprt_code: 11011`)
- **사업연도**: 최신 연도 우선 (2025 → 2024 fallback)

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Recharts |
| Backend | Vercel Serverless Functions (Node.js) |
| External API | DART Open API, OpenAI Chat API (`gpt-4o-mini`) |
| 배포 | Vercel |

---

## 시스템 아키텍처

```
React Frontend (Vite)
       ↓
Vercel Serverless / Vite Dev Middleware
       ↓
  ┌────┴────┐
  ↓         ↓
DART API   OpenAI GPT
  ↓         ↓
재무 수집 → 정규화 → AI 분석 → 대시보드
```

**보안**: `DART_API_KEY`, `OPENAI_API_KEY`는 **서버(`api/`)와 로컬 dev middleware에서만** 사용합니다. 클라이언트 번들·Network 탭에 노출되지 않습니다.

---

## 프로젝트 구조

```
├── api/
│   ├── compare.ts              # DART 수집 + GPT 분석
│   └── companies/search.ts     # KOSPI 기업 검색
├── public/data/
│   └── kospi-companies.json    # 종목·corp_code 목록
├── src/
│   ├── components/             # UI (WSJ 테마)
│   ├── hooks/
│   └── lib/
│       ├── dart/               # DART 클라이언트·정규화
│       ├── gpt/                # 프롬프트·분석 생성
│       └── compare/
└── scripts/                    # 검증 스크립트
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

`.env.example`을 참고해 **`.env.local`** 을 만듭니다.

```env
DART_API_KEY=발급받은_DART_인증키
OPENAI_API_KEY=sk-...
```

- DART API 키: [OPENDART](https://opendart.fss.or.kr/) 회원가입 후 발급
- `.env.local`은 Git에 커밋하지 마세요

### 3. 로컬 실행

```bash
npm run dev
# 특정 포트 예: npm run dev -- --port 5191
```

브라우저에서 `http://localhost:5173` (또는 지정한 포트) 접속 후, 기업 2개를 검색·선택하고 **비교 시작**을 클릭합니다.

### 4. 검증

```bash
npm run verify:search          # 기업 검색 (API 키 불필요)
npm run verify:e2e             # 3쌍 E2E (API 키 필요)
```

---

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/companies/search?q=` | KOSPI 기업 검색 |
| `POST` | `/api/compare` | 2개 기업 재무 비교 + GPT 분석 |

**`POST /api/compare` 요청 예시**

```json
{
  "companies": [
    { "corpCode": "00126380", "stockCode": "005930", "corpName": "삼성전자" },
    { "corpCode": "00164779", "stockCode": "000660", "corpName": "SK하이닉스" }
  ]
}
```

---

## Vercel 배포

1. 이 저장소를 GitHub에 연결
2. [Vercel](https://vercel.com)에서 프로젝트 Import
3. Environment Variables에 `DART_API_KEY`, `OPENAI_API_KEY` 등록
4. Deploy

`vercel.json`에 Vite 빌드·API 라우트 설정이 포함되어 있습니다.

---

## 디자인

Wall Street Journal 테마를 적용했습니다.

- Background `#F7F1E5` · Text `#111111` · Accent `#0B3954` · Border `#D8D2C2`
- Typography: Georgia, Merriweather, Times New Roman

---

## MVP 범위 / 향후 확장

**포함 (현재)**

- 2개 기업 비교, 연간 연결재무, ROE·부채비율·매출 성장률, Bar/Radar 차트, GPT 리포트

**향후 확장 (미구현)**

- PER, PBR, 배당수익률
- 10년 추세 분석
- 실적발표 자동 요약
- PDF 리포트 생성
- Agent 기반 기업 분석

---

## 성공 기준 (검증 시나리오)

아래 조합을 **30초 이내**에 분석 완료하는 것을 목표로 합니다.

1. 삼성전자 vs SK하이닉스
2. POSCO홀딩스 vs 현대차
3. LG에너지솔루션 vs 삼성SDI

---

## 면책

본 서비스는 **투자 권유가 아닌** 학습·참고용 정보입니다. 재무 데이터는 DART 공시 기준이며, 투자 결정은 본인 책임입니다.

---

## 라이선스

MIT (또는 프로젝트 과제 요구에 따름)

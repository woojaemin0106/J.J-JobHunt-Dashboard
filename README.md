# J.J JobHunt Dashboard

면접장에서 바로 시연 가능한 취업 준비 대시보드입니다.  
지원 현황, 이력서 버전, 메모, 통계를 한 흐름으로 관리할 수 있도록 설계했습니다.

## 1) 프로젝트 요약

- 핵심 목표: "5분 안에 핵심 플로우를 보여주는 안정적인 데모"
- 핵심 사용자: 취업 준비생(Primary), 리뷰어/면접관(Secondary)
- 운영 기준 문서:
  - [프로젝트 정책 문서](docs/00_PROJECT_BLUEPRINT.md)
  - [실행 가이드 문서](docs/01_EXECUTION_GUIDE.md)

## 2) 핵심 기능

- 인증
  - 일반 로그인/회원가입
  - 게스트 원클릭 로그인
  - 데모 계정 원클릭 로그인(환경변수 활성화 시)
- 지원서 관리
  - 지원서 CRUD
  - 상태 전환(writing/submitted/passed/failed)
  - URL 기반 검색/필터
- 이력서 버전 관리
  - 지원서별 버전 CRUD
- 메모/할 일
  - 메모 CRUD
  - 오늘 할 일 CRUD
- 통계
  - 상태 분포, 월별 추이, 핵심 지표 요약

## 3) 데모 시연(면접관용)

- 빠른 실행:
  1. 로그인 화면 진입
  2. `게스트로 바로 입장` 또는 `데모로 바로 보기`
  3. 홈의 `Interview demo quick flow` 패널에서
     - 지원 현황
     - 메모
     - 통계
       순서로 이동

- 자세한 스크립트:
  - [5분 데모 런북](docs/03_INTERVIEW_DEMO_RUNBOOK.md)

## 4) 기술 스택

- Frontend: React 19, TypeScript, Vite
- Styling: Tailwind CSS v4
- Auth/Backend: Supabase Auth
- Test: Vitest, React Testing Library, Playwright
- CI: GitHub Actions (`lint`, `unit`, `integration`, `build`, `e2e-smoke`, `coverage`)
- AI Workflow: PR AI Review(비차단 리포트)

## 5) 품질 게이트

- 로컬 필수 검증:
  - `npm run lint`
  - `npm run test:integration`
  - `npm run build`

- CI 필수 게이트:
  - `lint`
  - `unit`
  - `integration`
  - `build`
  - `e2e-smoke`

- 커버리지:
  - `npm run test:coverage`
  - 글로벌 임계값 70%

## 6) 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 7) 환경 변수

`.env.example`를 복사해 `.env`를 생성합니다.

```bash
cp .env.example .env
```

필수:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

데모 로그인(선택):

- `VITE_DEMO_ENABLED=true|false`
- `VITE_DEMO_EMAIL`
- `VITE_DEMO_PASSWORD`

`VITE_DEMO_ENABLED=true` + 이메일/비밀번호가 모두 설정된 경우에만  
`데모로 바로 보기` 버튼이 노출됩니다.

## 8) 테스트 명령어

```bash
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:e2e:smoke
```

## 9) 브랜치 전략

- `main`: production
- `dev`: integration baseline
- `feat/*`: feature branches

머지 정책: 커밋 이력 보존(스쿼시 금지)

## 10) 포트폴리오 증빙 문서

- [포트폴리오 증빙 패키지](docs/02_PORTFOLIO_PROOF_PACK.md)
- [5분 데모 런북](docs/03_INTERVIEW_DEMO_RUNBOOK.md)

---

문의나 리뷰 포인트는 이슈/PR 코멘트로 남겨주세요.

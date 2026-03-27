# Portfolio Proof Pack

- 문서 ID: `PP-2026-03`
- 문서 버전: `v2026.03.27`
- 기준일: `2026-03-27`
- 대상 독자: 면접관, 기술 리뷰어, 신규 협업자

## 1. 한 줄 설명

J.J JobHunt Dashboard는 취업 준비 과정을 "지원서 관리 → 이력서 버전 → 메모/할 일 → 통계"로 연결해, 면접장에서 5분 내에 검증 가능한 데모를 제공하는 웹앱입니다.

## 2. 문제-해결-성과

| 문제 | 해결 방식 | 검증 포인트 |
|---|---|---|
| 취업 준비 정보가 여러 도구에 흩어짐 | 단일 대시보드에 지원/메모/통계를 통합 | 핵심 라우트 5개를 한 세션에서 순환 시연 가능 |
| 로그인 설정 실패 시 데모가 중단됨 | 게스트 원클릭 로그인 + 데모 계정 로그인 병행 | Supabase 미설정 시에도 게스트 진입 가능 |
| 사용자 데이터 오염 위험 | user-scope 저장 키 + 1회 마이그레이션 | 로그인 전/후 및 사용자 전환 시 데이터 분리 |
| PR 품질 편차 | CI 필수 게이트 + 통합/E2E 스모크 | `lint/unit/integration/build/e2e-smoke` 통과 기준 |

## 3. 아키텍처/설계 포인트

1. 인증 경계
- 공개 라우트: `/login`, `/signup`
- 보호 라우트: `/`, `/applications`, `/resume`, `/notes`, `/statistics`
- `ProtectedRoute`, `PublicOnlyRoute`로 접근 정책을 강제

2. 데이터 경계
- 로컬 스토리지 키를 사용자 스코프로 분리
- 스키마 변경 시 1회 자동 이관(멱등 마커 사용)

3. UI 일관성
- 공통 UI 토큰(`src/utils/ui.ts`)으로 버튼/입력/카드 상태 일원화
- 공통 상태 컴포넌트(`StatusBanner`, `EmptyStateCard`, `LoadingScreen`)로 UX 패턴 표준화

4. 데모 최적화
- 로그인 화면: 게스트/데모 원클릭 진입
- 홈 화면: `Interview demo quick flow` 패널로 핵심 시연 동선 고정

## 4. 신뢰성 증빙

## 자동 게이트
- `npm run lint`
- `npm run test:unit`
- `npm run test:integration`
- `npm run build`
- `npm run test:e2e:smoke`
- `npm run test:coverage` (global threshold 70%)

## 수동 핵심 시나리오
- 인증: 로그인 성공/실패, 로그아웃, 보호 라우트 접근 제어
- 지원서: CRUD + 검색/필터 + 모달 진입 경로
- 메모/할 일: CRUD 및 상태 반영
- 통계: 데이터 변경 후 지표 반영 확인
- 데모: 게스트 로그인 후 5분 동선 재현

## 5. 데모 계정 운영 정책

- 데모 계정은 비권한/비민감 데이터 전용으로 운영
- 실제 개인정보/민감정보는 저장 금지
- 비밀번호 정기 교체(면접 시즌 기준 주기적 변경)
- 데모 실패 시 게스트 로그인으로 즉시 대체

## 6. 이력서 기재용 문장 예시

## 프로젝트 설명(요약형)
- React/TypeScript 기반 취업 준비 대시보드를 설계·구현하고, 인증/데이터 경계와 테스트 자동화를 포함한 데모 품질 게이트를 구축함.

## 성과 중심(검증형)
- 게스트/데모 원클릭 로그인과 라우트 보호 정책을 적용해 면접 환경에서 즉시 재현 가능한 5분 데모 플로우를 구축함.
- CI에 `lint/unit/integration/build/e2e-smoke`를 필수화하고 커버리지 기준(70%)을 적용해 회귀 리스크를 낮춤.

## 7. 면접 Q&A 포인트

1. 왜 게스트 로그인과 데모 로그인을 분리했나요?
- 외부 인증 장애 시에도 시연을 지속하기 위한 fail-safe 경로가 필요했기 때문입니다.

2. 왜 로컬 저장 키를 user-scope로 분리했나요?
- 다계정 사용/전환 시 데이터 오염을 막고, 회귀 테스트 시 격리된 상태를 재현하기 위해서입니다.

3. 품질 기준을 어떻게 강제했나요?
- 로컬 체크 + CI 필수 게이트 + 문서 기반 체크리스트를 함께 운영해 "통과 조건"을 명시적으로 관리했습니다.

## 8. 관련 문서

- 정책 기준: [00_PROJECT_BLUEPRINT.md](00_PROJECT_BLUEPRINT.md)
- 실행 기준: [01_EXECUTION_GUIDE.md](01_EXECUTION_GUIDE.md)
- 데모 시연 절차: [03_INTERVIEW_DEMO_RUNBOOK.md](03_INTERVIEW_DEMO_RUNBOOK.md)

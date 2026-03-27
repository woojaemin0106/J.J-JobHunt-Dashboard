# JJ 취업준비대시보드 실행 가이드

- 문서 ID: `EG-MASTER`
- 문서 버전: `v2026.03.27`
- 기준선 날짜: `2026-03-27`
- 정책 기준 문서(SSOT): `docs/00_PROJECT_BLUEPRINT.md`
- 문서 언어: 한국어 기본 (필요 시 기술 키워드만 영어 병기)

## 문서 운영 규칙
- 본 문서는 구현 담당자/리뷰 담당자가 실제 작업을 진행할 때 따라야 하는 실행 표준이다.
- 정책 충돌 시 `00_PROJECT_BLUEPRINT.md`를 MUST 우선한다.
- 모든 작업 카드/PR은 최소 1개 이상의 정책 ID(`BP-xx`)를 MUST 참조한다.
- 문서 변경 1차 책임은 작업 작성자, 2차 확인은 리뷰어가 SHOULD 수행한다.

## 실행 섹션 맵
| ID | 섹션 | 목적 |
|---|---|---|
| EG-01 | 실행 원칙 | 작업 전반의 공통 운영 규칙 |
| EG-02 | 작업 단위 템플릿 | 카드/작업 정의 표준 |
| EG-03 | 게이트형 초기 단계 | Gate 0~3 통과 기준 |
| EG-04 | 칸반 전환 기준 | 게이트 통과 후 운영 규칙 |
| EG-05 | 테스트 매트릭스 | 자동/수동 검증 범위 |
| EG-06 | PR 리뷰 가이드 | 승인/차단 기준 |
| EG-07 | 릴리즈 체크리스트 | 배포 전/중/후/롤백 절차 |
| EG-08 | 운영 루틴 | 데일리/주간/회고/문서 갱신 |
| EG-09 | 이슈 처리 런북 | 대표 장애 대응 흐름 |
| EG-10 | 온보딩 체크리스트 | 신규 참여자 첫 PR까지 표준 경로 |
| EG-11 | Gate 1+2 완료 근거 | 과거 게이트 완료 근거 기록 |
| EG-12 | Gate 3 운영 체크리스트 | 릴리즈/롤백 반복 가능성 확보 |
| EG-13 | 검색/필터 롤아웃 기록 | URL 기반 검색/필터 근거 |
| EG-14 | 인증 UX 리메이크 기록 | C4 인증 화면/테스트 근거 |
| EG-15 | 데모/AI 워크플로 런북 | 면접 데모 운영 + AI 리뷰 사용법 |

---

## EG-01 실행 원칙

### 정의
- 문서 우선, 작은 단위 배포, 회귀 방지 우선 원칙을 표준화한다.

### 현재 상태
- 기능 구현과 문서 반영 품질은 좋아졌지만, 작업 크기와 검증 근거 표준화는 지속 관리가 필요하다.

### 앞으로의 원칙
- 문서 우선: 구현 전 범위/완료 조건/검증 방법을 MUST 명시한다.
- 작은 단위 배포: 변경은 리뷰 가능한 크기로 SHOULD 분할한다.
- 회귀 방지 우선: 새 기능보다 기존 핵심 여정 안정성을 MUST 우선한다.

### 검증 기준
- [ ] 모든 PR 본문에 범위/완료 기준/검증 근거가 존재한다.
- [ ] 회귀 이슈 발생 시 테스트 매트릭스가 즉시 갱신된다.

## EG-02 작업 단위 템플릿

### 정의
- 구현 카드/이슈/PR이 동일 포맷으로 관리되도록 작업 단위 템플릿을 고정한다.

### 현재 상태
- 개인별 작성 형식 차이가 있어 리뷰어 판단 비용이 증가하는 경향이 있었다.

### 앞으로의 원칙
- 작업 카드에는 아래 항목을 MUST 포함한다.
  - 배경
  - 작업 내용
  - 영향 범위
  - 완료 조건
  - 검증 방법
- 영향 범위에는 사용자 영향/데이터 영향/운영 영향이 SHOULD 포함된다.

### 검증 기준
- [ ] 작업 카드 누락 항목(배경/완료 조건/검증)이 0건이다.
- [ ] 완료된 카드에는 테스트/문서 반영 근거가 존재한다.

## EG-03 게이트형 초기 단계 (Gate 0~3)

### 정의
- 재시작 초기 품질 안정화를 위해 Gate 0~3을 순차 통과한다.

### 현재 상태
- Gate 1~3 기반 품질 체계가 적용되어 있으며, 운영 단계에서는 체크리스트 재현성이 중요하다.

### 앞으로의 원칙
- Gate는 MUST 순차 통과한다(건너뛰기 금지).
- 각 Gate는 산출물/검증 근거를 저장소 문서로 남긴다.

### Gate 정의
1. Gate 0 (기준선)
- 목표: 실행/빌드/린트/환경 변수 문서화 완료
- 필수 산출물:
  - 실행/빌드 명령
  - 린트 결과 기준
  - 필수 환경변수 목록 및 설명

2. Gate 1 (품질 안정화)
- 목표: lint 에러 0, 타입 에러 0, 핵심 플로우 수동 테스트 통과
- 필수 산출물:
  - lint/type 이슈 정리 기록
  - 핵심 플로우 수동 테스트 체크리스트

3. Gate 2 (경계 확립)
- 목표: 인증 경계, 데이터 경계, 에러 핸들링 기준 적용
- 필수 산출물:
  - 라우트 보호 정책 반영 증거
  - 저장 키/마이그레이션 계약 증거
  - 오류 메시지/로그 기준 반영 증거

4. Gate 3 (운영 준비)
- 목표: CI, PR 품질 게이트, 릴리즈/롤백 절차 확정
- 필수 산출물:
  - CI 워크플로 상태 및 필수 체크
  - PR 승인 체크리스트 강제 규칙
  - 릴리즈/롤백 실행 절차

### 검증 기준
- [ ] Gate별 진입/종료 기준이 수치/행동 기준으로 명확하다.
- [ ] Gate 종료 시점 산출물이 문서에 반영된다.

## EG-04 칸반 전환 기준

### 정의
- Gate 통과 후 연속 개선 운영으로 전환하는 칸반 규칙을 정의한다.

### 현재 상태
- 기능/품질/문서 작업이 병렬로 증가해 우선순위 규칙이 중요해졌다.

### 앞으로의 원칙
- Gate 0~3 완료 후 칸반으로 MUST 전환한다.
- 칸반 규칙:
  - WIP 제한: 진행 중 카드 최대 3개
  - 우선순위: 사용자 영향도 > 회귀 위험도 > 구현 비용
  - 완료 조건: 구현 + 테스트 + 문서 반영 + 리뷰 승인

### 검증 기준
- [ ] WIP 제한 위반 카드가 없다.
- [ ] 완료 카드에 테스트/문서/리뷰 근거가 모두 존재한다.

## EG-05 테스트 매트릭스

### 정의
- 단위/통합/수동 점검을 포함한 필수 검증 범위를 표준화한다.

### 현재 상태
- Unit/Integration/E2E smoke/Build 게이트가 갖춰졌고, 수동 시나리오 문서 연결이 중요하다.

### 앞으로의 원칙
- 자동 테스트와 수동 점검을 MUST 병행한다.
- 핵심 도메인(인증/지원서/메모/할일/통계) 회귀 방지 시나리오는 MUST 유지한다.

### 테스트 매트릭스
| 범주 | 대상 | 필수 시나리오 |
|---|---|---|
| Unit | 상태 전이/리듀서/파라미터 정규화 | auth/application/note/todo state policy |
| Integration | Provider/Route/Auth/UI 상호작용 | 인증 초기화, 라우트 가드, 검색/필터, demo login |
| E2E Smoke | 앱 진입 핵심 흐름 | 게스트 진입/로그인 진입 핵심 경로 |
| Manual | 제품 핵심 여정 | 인증, Application CRUD, Note CRUD, Todo CRUD, Statistics |

### 회귀 방지 핵심 시나리오
- 인증: 로그인 성공/실패, 로그아웃, 보호 라우트 직접 접근
- 지원서: 추가/수정/상태 변경/모달 경로(`?new=true`) 확인
- 이력서 버전: 추가/삭제
- 메모: 추가/편집/삭제
- 할일: 추가/토글/삭제
- 통계: 데이터 변경 후 수치 반영
- 데이터 경계: 사용자 스코프 분리/보존

### 검증 기준
- [ ] PR마다 자동 테스트 결과가 첨부된다.
- [ ] 수동 핵심 시나리오 결과가 기록된다.

## EG-06 PR 리뷰 가이드

### 정의
- 리뷰어가 동일 기준으로 승인/차단 결정을 내릴 수 있도록 PR 체크 규칙을 고정한다.

### 현재 상태
- 품질 게이트는 강화됐고, 리스크 서술 품질의 일관성 확보가 과제다.

### 앞으로의 원칙
- PR 필수 체크:
  - 정책 ID(`BP-xx`) 참조 포함
  - 변경 범위/완료 기준/검증 근거 포함
  - 리스크/롤백 조건 명시
- PR 차단 조건:
  - 필수 테스트 미통과
  - 사용자 여정 회귀 가능성 미해결
  - 문서-코드 불일치
- 승인 기준:
  - 요구사항 충족 + 회귀 위험 통제 + 운영 리스크 명확

### 검증 기준
- [ ] 모든 PR이 정책 ID를 포함한다.
- [ ] 차단 조건 위반 PR이 머지되지 않는다.

## EG-07 릴리즈 체크리스트

### 정의
- 사전 점검/배포/사후 확인/롤백 트리거를 표준화한다.

### 현재 상태
- CI는 강화되었고, 배포 운영의 반복 가능성을 문서로 유지해야 한다.

### 앞으로의 원칙
- 사전 점검(Pre-release):
  - `npm run lint`, `npm run build` 통과
  - CI 필수 체크 green
  - 필수 env 값 확인 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - 핵심 라우트/저장 경계 수동 검증
- 배포(Release):
  - 머지 커밋/변경 요약 확인
  - 배포 창구/담당자 공지
  - 배포 시각 기록
- 사후 확인(Post-release):
  - 인증/라우트/핵심 CRUD/콘솔 상태 확인
- 롤백 트리거:
  - 로그인 불가
  - 사용자 스코프 데이터 오염/유실
  - 핵심 흐름 회귀

### 검증 기준
- [ ] 릴리즈마다 사전/사후 점검 기록이 남는다.
- [ ] 롤백 이벤트 발생 시 사고 기록이 생성된다.

## EG-08 운영 루틴

### 정의
- 데일리/주간/회고/문서 갱신 루틴으로 운영 품질을 유지한다.

### 현재 상태
- 루틴은 운영 중이며 문서 반영 타이밍 통제가 중요하다.

### 앞으로의 원칙
- 데일리: 리스크/차단 이슈 공유, WIP 점검
- 주간 리뷰: KPI 변화, 우선순위, 리스크 레지스터 갱신
- 회고: 개선안 도출 후 문서/테스트 반영
- 문서 갱신: 작업 작성자 1차, 리뷰어 2차 확인

### 검증 기준
- [ ] 데일리/주간/회고 기록 누락이 없다.
- [ ] 문서 버전이 실제 변경을 반영한다.

## EG-09 이슈 처리 런북

### 정의
- 대표 장애 유형별 탐지/진단/복구/재발 방지 절차를 정의한다.

### 현재 상태
- 장애 대응 경험은 축적 중이며 표준 런북 유지가 필요하다.

### 앞으로의 원칙
- 공통 절차:
  1. 탐지: 증상/영향 범위 확인
  2. 진단: 원인 후보 1~3개 압축
  3. 복구: 즉시 완화 조치 우선
  4. 재발 방지: 근본 원인 수정 + 테스트/문서 반영
- 유형별 기본 대응:
  - 인증 실패: 세션/env/라우트 경계 점검
  - 데이터 유실: 저장 키 스코프/마이그레이션/직전 배포 비교
  - 빌드 실패: 최근 변경 격리 및 최소 재현
  - 성능 저하: 프로파일링 + 최근 렌더링 변경 분석

### 검증 기준
- [ ] 장애 건마다 4단계 기록이 남는다.
- [ ] 재발 방지 항목이 코드/문서에 반영된다.

## EG-10 온보딩 체크리스트

### 정의
- 신규 참여자가 첫날부터 첫 PR 완료까지 도달하는 최소 표준 경로를 정의한다.

### 현재 상태
- 기본 온보딩 자산은 존재하며 실행 체크리스트 관리가 필요하다.

### 앞으로의 원칙
- Day 1:
  - `npm install`, `npm run dev`, `npm run build`, `npm run lint` 확인
  - `00_PROJECT_BLUEPRINT.md`, `01_EXECUTION_GUIDE.md` 읽기
  - 핵심 사용자 여정 수동 실행
- Day 2~3:
  - 작은 범위 카드 1개 수행
  - 정책 ID 포함 PR 작성
- First PR:
  - 테스트 근거 + 문서 반영 + 리뷰 피드백 반영

### 검증 기준
- [ ] 신규 참여자 첫 PR이 정책/테스트/문서 기준을 충족한다.

---

## EG-11 Gate 1+2 완료 근거 (2026-03-26)

### Definition
- Gate 1(품질 안정화), Gate 2(경계 확립)의 적용 근거를 기록한다.

### Current State
- Gate 1/2 관련 커밋은 분리되어 관리되었고, lint/build 기준이 통과 상태다.

### Principles Going Forward
- 아래 표를 Gate 완료 기록 최소 포맷으로 유지한다.

| Gate | 변경 항목 | 근거 커밋(요약) | 정책 ID |
|---|---|---|---|
| Gate 1 | 저위험 lint 정리(no-unused-vars, any 제거) | `fix: resolve low-risk lint issues in auth and forms` | BP-11, BP-13 |
| Gate 1 | set-state-in-effect 제거 | `refactor: remove set-state-in-effect from applications modal flow` | BP-11 |
| Gate 1 | store 범위 ESLint 국소 완화 | `chore: relax react-refresh rule for store context modules` | BP-13 |
| Gate 2 | 인증 경계 정리(중복 Provider 제거, 공개/보호 라우트) | `feat: add route guards and remove duplicate auth provider` | BP-09 |
| Gate 2 | user 스코프 저장 키 + 1회 마이그레이션 | `feat: scope persisted data by user with one-time migration` | BP-08 |
| Gate 2 | 오류 처리 문구/로그 기준 정렬 | `refactor: standardize auth error messages and safe diagnostics` | BP-12 |

### Verification Criteria
- [ ] Gate 완료 PR 본문에 본 섹션 링크와 수기 검증 결과가 포함된다.

## EG-12 Gate 3 Operational Checklist (Release & Rollback)

### Definition
- Release/Rollback 절차의 재현 가능 최소 기준을 정의한다.

### Current State
- CI 품질 게이트는 도입됐고, 운영 실행 일관성은 계속 관리 중이다.

### Principles Going Forward
- 모든 릴리즈는 동일한 pre-release/release/post-release/rollback 절차를 따라야 한다.

### Pre-release Checklist
- [ ] `npm run lint` passed on release branch
- [ ] `npm run build` passed on release branch
- [ ] CI workflow status is green for PR targeting `dev`
- [ ] Required env vars are present (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Core route guard scenarios are manually verified
- [ ] Storage scope and migration behavior are manually verified

### Rollback Procedure
1. 롤아웃 중단 및 팀 공지
2. `dev` 릴리즈 커밋 revert
3. 직전 안정 버전 재배포
4. 사후 체크리스트 재실행
5. 사고 기록 + 재발 방지 항목 등록

### Verification Criteria
- [ ] 신규 참여자가 추가 구두 설명 없이 체크리스트를 수행할 수 있다.

## EG-13 Applications Search & Filter Rollout (2026-03-26)

### Definition
- URL 기반 검색/필터 기능의 구현 근거를 기록한다.

### Current State
- `/applications`는 `query`, `status`, `new` 쿼리 계약을 사용한다.

### Principles Going Forward
- 쿼리 키 변경은 `src/pages/applicationsSearchParams.ts`를 SSOT로 관리한다.

### Manual Verification Checklist
- [x] Header Enter 검색 시 `/applications?query=...`로 이동
- [x] 상태 필터 변경 시 URL/보드 결과 동기화
- [x] 필터 초기화 시 `query/status` 초기화 및 `new` 보존
- [x] 결과 0건 시 복구 가이드 카드 노출
- [x] `npm run lint` + `npm run build` 통과

### Verification Criteria
- [ ] 정책 ID(`BP-03`, `BP-04`, `BP-10`, `BP-11`)가 PR 본문과 일치한다.

## EG-14 Auth Experience Remake (2026-03-27)

### Definition
- `/login`, `/signup` 인증 경험 리메이크(C4)의 구현/검증 근거를 기록한다.

### Current State
- 인증 화면 리메이크 및 auth 폼 통합 테스트가 `PR #22`로 머지 완료되었다.

### Principles Going Forward
- 인증 UX 변경은 라우트 가드/인증 상태 계약을 MUST 유지한다.
- Demo login 노출은 환경설정(`isSupabaseConfigured`, demo env config)과 MUST 동기화한다.
- 기존 테스트 선택자 계약(`data-testid`)은 CI 안정성을 위해 SHOULD 유지한다.

### Manual Verification Checklist
- [x] `/login` 라벨/에러/버튼 상태가 접근성 기준에 맞게 동작한다.
- [x] 데모 로그인 블록은 환경조건 충족 시에만 노출된다.
- [x] `/signup` 성공 시 `/`로 이동하고 실패 시 복구 문구가 노출된다.
- [x] `npm run lint`, `npm run test:integration`, `npm run build` 통과

### Verification Criteria
- [ ] 후속 인증 UX PR은 본 섹션과 통합 테스트를 함께 갱신한다.

## EG-15 Demo & AI Workflow Runbook (2026-03-27)

### Definition
- 면접 데모 운영 절차와 AI 리뷰 워크플로 사용법을 실행 관점에서 정의한다.

### Current State
- 원클릭 데모 로그인과 AI 리뷰 워크플로가 도입되어 있고, 운용 절차 문서화가 필요하다.

### Principles Going Forward
- 데모 계정 운영:
  - 비권한/비민감 데이터 계정만 사용 MUST
  - 주기적 비밀번호 교체 SHOULD
  - 면접 전 체크리스트 실행 MUST
- AI 리뷰 워크플로:
  - 자동 실행: PR open/sync/reopen
  - 수동 실행: PR 코멘트 `/ai-review`
  - `OPENAI_API_KEY` 미설정/실패 시 리포트 스킵으로 처리(비차단)

### Interview Demo Checklist (5분)
1. 로그인 화면 진입 후 데모 로그인 버튼 노출 확인
2. 데모 계정 로그인
3. 지원 현황 보드에서 상태 필터/검색 시연
4. 이력서 버전/메모/통계 화면 순차 시연
5. 로그아웃 후 보호 라우트 차단 동작 확인

### Verification Criteria
- [ ] 면접관이 체크리스트만 보고 동일 동선을 재현할 수 있다.
- [ ] AI 리뷰 실패가 핵심 품질 게이트(test/lint/build)를 차단하지 않는다.

## EG-16 Release Candidate Finalization (2026-03-27)

### Definition
- Record the final hardening status for the portfolio release candidate (`rc1`).

### Current State
- Local CI-mirror verification completed.
  - `npm run lint`: passed
  - `npm run build`: passed
  - `npm run test:coverage`: passed (global 76.47%, branch 70.54%)
  - `npm run test:e2e:smoke`: passed (1 passed, 1 skipped because demo env is optional)
- Gate 3 operations (CI, quality gate, release/rollback procedure) are connected by workflow and docs.

### Principles Going Forward
- Every final PR before merging to `dev` MUST run CI-mirror checks (`lint`, `build`, `coverage`, `e2e smoke`).
- Release checklist and rollback triggers MUST be explicitly included in the PR body.
- Demo runbook and proof-pack docs SHOULD be updated together for interview-ready releases.

### Verification Criteria
- [ ] CI required checks (`lint`, `unit`, `integration`, `build`, `e2e-smoke`) are all green.
- [ ] Coverage stays at or above global threshold (70%).
- [ ] The 5-minute demo flow (login -> applications -> notes/statistics) is reproducible.
- [ ] Release and rollback checklist items are reflected in the PR body.

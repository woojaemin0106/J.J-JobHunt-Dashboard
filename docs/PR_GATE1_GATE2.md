# PR 본문 초안 - Gate 1+2

## ✅ What changed

- Gate 1 품질 안정화
  - 저위험 lint 정리(`no-unused-vars`, `any`)
  - `set-state-in-effect` 제거
  - `src/store/**` 범위에 한정한 `react-refresh/only-export-components` 완화
- Gate 2 경계 확립
  - 인증 경계 정리(중복 `AuthProvider` 제거, 공개/보호 라우트 가드 적용)
  - user 스코프 저장 키(`jj.jobhunt.{resource}.v2.user:{scope}`) 적용
  - 레거시 키(`jj_jobhunt_*_v1`) → 신규 키 1회 자동 마이그레이션(멱등 마커 포함)
  - 인증/저장 실패 메시지 및 로그 기준 정렬

## 🎯 Goal / Context

- 관련 정책 ID: `BP-08`, `BP-09`, `BP-11`, `BP-12`, `BP-13`
- 목표: Gate 1+2를 한 배치로 완료하고, 품질/경계/오류 처리 기준을 코드와 문서에 동시에 정착

## 🔍 How to test

1. `npm install`
2. `npm run lint` (통과)
3. `npm run build` (통과)
4. 비인증 상태에서 보호 라우트(`/, /applications, /resume, /notes, /statistics`) 접근 시 `/login` 리다이렉트 확인
5. 인증 상태에서 `/login`, `/signup` 접근 시 `/` 리다이렉트 확인
6. 지원서 모달:
   - 버튼으로 신규 열기
   - 카드 클릭으로 수정 열기
   - `?new=true`로 진입 시 열기/닫기 동작 확인
7. localStorage 확인:
   - 신규 키 패턴 `jj.jobhunt.{resource}.v2.user:{scope}` 저장 확인
   - 레거시 키 존재 시 최초 1회 이관 및 중복 이관 방지 확인

## ✅ Manual Verification Table

| 항목 | 결과 |
|---|---|
| 보호/공개 라우트 경계 | 통과 |
| 모달 열기/닫기 흐름(`?new=true` 포함) | 통과 |
| user 스코프 키 저장 | 통과 |
| 레거시 1회 마이그레이션 + 멱등 | 통과 |
| 오류 메시지 복구 행동 중심 문구 | 통과 |
| lint/build | 통과 |

## ✅ Checklist

- [x] 정책 ID 참조 포함
- [x] 자동 검증(`lint`, `build`) 통과
- [x] 수기 검증 표 포함
- [x] 리스크 및 롤백 관점 포함
- [x] 실행 문서 동기화(`docs/01_EXECUTION_GUIDE.md`의 EG-11 섹션)

## 📌 Risk / Rollback

- 리스크:
  - 라우팅 경계 변경으로 인증 초기 로딩 시점의 화면 전환 타이밍 이슈 가능
  - 저장 키 스코프 전환 시 사용자 전환 케이스 누락 가능
- 롤백 트리거:
  - 비인증 사용자의 보호 라우트 접근 제어 실패
  - 사용자 스코프 데이터 손실/오염
- 롤백 방법:
  - 본 PR 이전 커밋으로 되돌린 뒤 레거시 키 데이터 상태 확인

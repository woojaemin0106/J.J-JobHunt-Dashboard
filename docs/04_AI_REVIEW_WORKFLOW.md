# AI Review Workflow Guide

- 문서 ID: `AIW-01`
- 문서 버전: `v2026.03.27`
- 기준일: `2026-03-27`

## 1. 목적

PR 리뷰 단계에서 누락되기 쉬운 리스크/테스트 포인트/UI 일관성 점검을 자동으로 보조합니다.  
핵심 품질 게이트(`lint`, `unit/integration`, `build`, `e2e-smoke`)를 대체하지 않고 보완합니다.

## 2. 트리거

- 자동 실행: PR `opened`, `reopened`, `synchronize`, `ready_for_review`
- 수동 실행: PR 코멘트에 `/ai-review`
  - 보안 제한: `OWNER`, `MEMBER`, `COLLABORATOR`만 수동 트리거 가능

## 3. 구성

- 워크플로: `.github/workflows/ai-review.yml`
- 스크립트: `.github/scripts/ai-review.mjs`
- 프롬프트 팩:
  - `.github/ai-prompts/reviewer.md`
  - `.github/ai-prompts/test-suggestions.md`
  - `.github/ai-prompts/ui-consistency.md`

## 4. 출력 형식

AI 리포트는 아래 섹션을 고정 형식으로 생성합니다.

1. `Change Summary`
2. `Top Risks` (High/Medium/Low)
3. `Missing Tests`
4. `UI Consistency Checklist`
5. `Suggested Next Actions`

추가 메타데이터:
- 모델명
- diff 파일 경로
- 변경 파일 수

## 5. 실패 처리 정책

- OpenAI API 실패/키 누락/빈 diff일 경우:
  - CI 실패로 차단하지 않고 `AI Review Report (Skipped)` 코멘트를 남깁니다.
- 이 경우에도 필수 품질 게이트는 그대로 유지됩니다.

## 6. 운영 팁

- 프롬프트 수정 시:
  - 특정 지시가 너무 장황하면 간결화
  - 프로젝트 정책(`docs/00_PROJECT_BLUEPRINT.md`) 기준과 충돌하지 않도록 유지
- PR에 코멘트가 누적되지 않도록:
  - 마커(`<!-- ai-review-report -->`) 기반으로 기존 봇 코멘트를 업데이트합니다.
- 리포트 추적:
  - workflow artifact로 `ai-review-report-auto`, `ai-review-report-manual` 파일이 업로드됩니다.

## 7. 점검 체크리스트

- [ ] `OPENAI_API_KEY`가 GitHub Secrets에 등록됨
- [ ] 필요 시 `OPENAI_MODEL` Repository Variable 설정됨
- [ ] PR에서 AI 리포트 코멘트가 1개로 갱신되는지 확인
- [ ] API 실패 시 `Skipped` 리포트가 생성되는지 확인

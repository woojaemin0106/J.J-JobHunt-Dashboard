# J.J JobHunt Dashboard

취업 준비 과정을 한 화면에서 관리하는 대시보드(지원 현황 / 일정 / 이력서 버전 / 면접 준비).

## Demo

- Live: (배포 후 추가)
- Figma/Notion: (있으면 추가)

## Features (MVP)

- 지원 파이프라인(칸반): 관심 → 지원 → 과제 → 면접 → 결과
- 지원 카드 CRUD: 회사/직무/마감일/D-day/메모/링크
- 주간 요약: 이번 주 마감/면접/할 일

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- (예정) Supabase / Firebase
- (예정) TanStack Query, React Hook Form

## Getting Started

```bash
npm install
npm run dev
```

Conventions

Branch: main(release) / dev(integration) / feat/\*(feature)

Commit message: feat:, fix:, refactor:, docs:, chore:

PR: dev로만 머지, 스크린샷/테스트 방법 포함

Roadmap

로그인/유저별 데이터 분리

이력서 버전 관리

면접 Q&A 라이브러리

통계(지원률/진행률) & 캘린더 연동

Team

[우재민] (Frontend)

[김재윤] (Frontend)

## Environment Variables

Copy `.env.example` to `.env` and fill your values.

```bash
cp .env.example .env
```

Required variables:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

If one of these values is missing, authentication-related features may not work correctly.

## Local Setup Checklist

1. Install dependencies: `npm install`
2. Create `.env` from `.env.example`
3. Run app: `npm run dev`
4. Quality check before PR: `npm run lint` and `npm run build`

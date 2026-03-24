# Architecture Overview

## Tech Stack
- **Framework**: Next.js 16.2 (App Router)
- **Styling**: Stitches CSS-in-JS
- **Language**: TypeScript
- **State**: (TBD - Zustand/Jotai 권장)
- **Auth**: (TBD)
- **Database**: (TBD)

## Directory Structure

```
src/
├─ app/              # Next.js App Router (routes & layouts)
├─ components/       # 재사용 가능한 UI 컴포넌트
│  ├─ ui/           # 기본 디자인 시스템 컴포넌트
│  └─ features/     # 기능별 복합 컴포넌트
├─ config/          # 앱 설정 (stitches, env 등)
├─ hooks/           # 커스텀 React hooks
├─ lib/             # 유틸리티 함수
├─ services/        # API 통신 레이어
├─ store/           # 전역 상태 관리
└─ types/           # TypeScript 타입 정의
```

## Key Patterns

### Components
- **UI Components**: atoms/molecules (재사용 가능)
- **Feature Components**: organisms (비즈니스 로직 포함)
- Props는 명시적 타입 정의 필수

### Data Fetching
- Server Components 우선 사용
- Client Components는 상호작용 필요시만
- React Server Actions 활용

### API Routes
- `/app/api/` 하위에 RESTful 구조
- Validation은 Zod 사용
- Error handling 표준화

### State Management
- Server State: React Query/SWR
- Client State: 최소화, 필요시 Zustand
- Form State: React Hook Form

## Code Conventions
- 파일명: kebab-case
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE
- 타입/인터페이스: PascalCase

## Performance
- 번들 사이즈 모니터링
- Dynamic imports로 코드 스플리팅
- Image 최적화 (next/image)
- Font 최적화 (next/font)

# NextGen

kmtls의 기업용 SaaS 플랫폼입니다.

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| ORM | Prisma (PostgreSQL) |
| Utilities | clsx, tailwind-merge |

## 시작하기

### 요구사항

- Node.js 18+
- PostgreSQL

### 설치

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 값 입력

# DB 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 프로젝트 구조

```
nextgen/
├── prisma/
│   └── schema.prisma          # DB 스키마 (User, Organization)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # 로그인 페이지
│   │   │   └── register/      # 회원가입 페이지
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/     # 대시보드 메인
│   │   │   ├── settings/      # 조직 설정
│   │   │   └── users/         # 사용자 관리
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 랜딩 페이지
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx  # 대시보드 공통 레이아웃
│   │   │   ├── Header.tsx           # 상단 헤더
│   │   │   └── Sidebar.tsx          # 사이드바 네비게이션
│   │   └── ui/
│   │       ├── Button.tsx     # 버튼 컴포넌트 (5가지 variant)
│   │       └── Card.tsx       # 카드 컴포넌트
│   ├── config/
│   │   └── app.ts             # 앱 설정, 라우트, 플랜 정의
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts      # HTTP API 클라이언트
│   │   └── utils/
│   │       └── index.ts       # cn(), formatDate() 등 유틸 함수
│   └── types/
│       └── index.ts           # 공통 타입 정의
└── .env.example               # 환경변수 템플릿
```

## 주요 기능

- **인증** — 로그인 / 회원가입 (조직 단위)
- **대시보드** — 주요 지표 통계 카드
- **사용자 관리** — 조직 내 멤버 초대 및 관리
- **설정** — 조직 정보 및 플랜 관리

## 플랜

| 플랜 | 사용자 | 프로젝트 | 가격 |
|------|--------|----------|------|
| Free | 5 | 3 | 무료 |
| Starter | 25 | 10 | $29/월 |
| Professional | 100 | 50 | $99/월 |
| Enterprise | 무제한 | 무제한 | 문의 |

## 스크립트

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

## 환경변수

주요 환경변수는 `.env.example`을 참고하세요.

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NEXTAUTH_SECRET` | 인증 시크릿 키 |
| `NEXT_PUBLIC_APP_URL` | 앱 URL |

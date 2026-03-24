# KMTLS Next-Gen

중량물·도비 업계 특화 엔터프라이즈 SaaS 플랫폼

## 개요

KMTLS Next-Gen은 AI 기반 중량물·도비 통합 운영 플랫폼으로, 안전성, 효율성, 수익성 극대화를 목표로 합니다.

**주요 고객**: 삼성, LG 등 대기업 건설 현장
**주요 장비**: 크레인, 지게차 (25톤~1,200톤)
**규정 준수**: 중대재해처벌법 대응

---

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Stitches |
| Authentication | NextAuth.js v5 (Auth.js) |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Encryption | AES-256-CBC (Node.js crypto) |
| Validation | Zod |

---

## 시작하기

### 요구사항

- Node.js 18+
- PostgreSQL 16+
- npm 또는 yarn

### 설치

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정 (자동 키 생성)
./scripts/setup-auth.sh

# 3. 데이터베이스 생성
createdb nextgen_db

# 4. DB 마이그레이션
export DATABASE_URL="postgresql://user@localhost:5432/nextgen_db"
npx prisma migrate dev

# 5. 시드 데이터 추가 (admin 계정 생성)
npx prisma db seed

# 6. 개발 서버 실행
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 테스트 계정

Seed 실행 후 다음 계정으로 로그인 가능:

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 (SUPER_ADMIN) | admin@kmtls.co.kr | admin |
| 매니저 (MANAGER) | manager@kmtls.co.kr | manager123 |
| 운전사 (MEMBER) | operator@kmtls.co.kr | operator123 |
| 안전관리자 (MANAGER) | safety@kmtls.co.kr | safety123 |

---

## 프로젝트 구조

```
nextgen/
├── docs/
│   ├── auth-system.md          # 인증 시스템 문서
│   ├── DATABASE.md             # 데이터베이스 ERD
│   └── features/               # 기능별 명세서 (14개 모듈)
├── prisma/
│   ├── schema.prisma           # DB 스키마 (33개 테이블)
│   ├── seed.ts                 # 시드 데이터
│   └── migrations/             # 마이그레이션 히스토리
├── scripts/
│   └── setup-auth.sh           # 인증 키 자동 생성
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # 로그인 (이메일/Kakao)
│   │   │   └── register/       # 회원가입
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/  # NextAuth 핸들러
│   │   │   │   └── register/       # 회원가입 API
│   │   │   ├── user/
│   │   │   │   └── profile/        # 프로필 CRUD
│   │   │   └── organization/
│   │   │       └── positions/      # 커스텀 직급 관리
│   │   └── page.tsx            # 랜딩 페이지
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx   # 로그인 폼
│   │   │   └── RegisterForm.tsx # 회원가입 폼
│   │   └── ui/
│   │       ├── Button.tsx      # UI 컴포넌트
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma 클라이언트
│   │   ├── encryption.ts       # AES-256 암호화
│   │   └── utils/
│   ├── services/
│   │   └── user-profile.service.ts  # 프로필 비즈니스 로직
│   ├── types/
│   │   └── next-auth.d.ts      # NextAuth 타입 확장
│   ├── auth.ts                 # NextAuth 설정
│   └── proxy.ts                # 인증 미들웨어
├── ARCHITECTURE.md             # 아키텍처 가이드
├── DESIGN_SYSTEM.md            # 디자인 시스템
├── PRODUCT_SPEC.md             # 제품 명세
└── .env.local                  # 환경변수 (자동 생성)
```

---

## 데이터베이스

### 📊 ERD & 스키마 문서

전체 데이터베이스 구조는 **[DATABASE.md](./DATABASE.md)** 참조

### 주요 통계

- **총 테이블**: 33개
- **도메인**: 8개 (인증, CRM, 프로젝트, 장비, 스케줄링, 재무, 안전, 문서)
- **Enums**: 25개
- **관계**: 60+ One-to-Many, 다수 Many-to-Many

### 도메인별 테이블

| 도메인 | 테이블 수 | 주요 모델 |
|--------|----------|-----------|
| 🔐 인증 & 조직 | 5 | Organization, User, CustomPosition |
| 👥 CRM | 2 | Customer, Contact |
| 📋 프로젝트 | 2 | Project, ProjectMilestone |
| 💰 견적 & 계약 | 4 | Quote, QuoteItem, Contract |
| 🏗️ 장비 관리 | 3 | Equipment, EquipmentType, MaintenanceRecord |
| 📅 스케줄링 | 4 | Schedule, WorkOrder, Crew, CrewAssignment |
| 💵 재무 | 3 | Invoice, InvoiceItem, Payment |
| ⚠️ 안전 | 3 | SafetyIncident, SafetyChecklist, ChecklistItem |
| 📄 문서 | 1 | Document |

**자세한 ERD 다이어그램**: [DATABASE.md](./DATABASE.md#entity-relationship-diagram)

---

## 주요 기능

### ✅ 구현 완료 (MVP Phase 1)

#### 1. 인증 & 권한
- ✅ 이메일/비밀번호 로그인
- ✅ Kakao OAuth 로그인
- ✅ Role-based Access Control (4단계 권한)
- ✅ 암호화된 주민번호 저장 (AES-256-CBC)
- ✅ 조직별 데이터 격리
- ✅ 커스텀 직급 시스템

#### 2. 조직 관리
- ✅ 조직 생성 및 관리
- ✅ 사용자 프로필 (개인정보, 직무정보, 비상연락처)
- ✅ 직급 체계 커스터마이징

#### 3. 데이터베이스
- ✅ 전체 스키마 설계 (33개 테이블)
- ✅ CRM & 고객 관리
- ✅ 프로젝트 관리
- ✅ 견적 & 계약
- ✅ 장비 & 자산 관리
- ✅ 스케줄링 & 배차
- ✅ 재무 관리
- ✅ 안전 관리
- ✅ 문서 관리

### 🚧 개발 예정 (Phase 2-3)

- [ ] 대시보드 & 분석
- [ ] CRM 고객 관리 UI
- [ ] 프로젝트 관리 UI
- [ ] 견적서 발행
- [ ] 장비 배차 시스템
- [ ] 스케줄 캘린더
- [ ] 청구 & 결제
- [ ] 안전 점검 체크리스트
- [ ] AI 예측 시스템
- [ ] 실시간 모니터링

---

## 보안

### 암호화
- **AES-256-CBC**: 주민번호 암호화
- **bcrypt**: 비밀번호 해싱 (12 rounds)
- **JWT**: 세션 토큰 (30일 만료)

### 접근 제어
- **RBAC**: SUPER_ADMIN > ADMIN > MANAGER > MEMBER
- **Organization Isolation**: 조직별 데이터 완전 분리
- **Middleware Protection**: 인증되지 않은 접근 차단

### 규정 준수
- **개인정보보호법**: 민감정보 암호화 저장
- **중대재해처벌법**: 안전 사고 관리 시스템
- **전자문서법**: 디지털 증빙 자료 보관

---

## API 문서

### 인증

**POST /api/auth/register**
- 조직 + 사용자 생성
- 첫 사용자는 자동으로 ADMIN

**POST /api/auth/callback/credentials**
- 이메일/비밀번호 로그인

**GET /api/auth/callback/kakao**
- Kakao OAuth 로그인

### 사용자

**GET /api/user/profile**
- 현재 사용자 프로필 조회

**PATCH /api/user/profile**
- 프로필 업데이트 (주민번호 자동 암호화)

### 조직

**GET /api/organization/positions**
- 커스텀 직급 목록

**POST /api/organization/positions** (ADMIN only)
- 새 직급 생성

---

## 스크립트

```bash
# 개발
npm run dev              # 개발 서버 (http://localhost:3000)
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버
npm run lint             # ESLint 검사

# 데이터베이스
npx prisma migrate dev   # 마이그레이션 실행
npx prisma db seed       # 시드 데이터 추가
npx prisma studio        # Prisma Studio (GUI)
npx prisma generate      # Prisma Client 재생성

# 유틸리티
./scripts/setup-auth.sh  # 환경변수 자동 생성
```

---

## 환경변수

### 필수 변수

```env
# Database
DATABASE_URL="postgresql://user@localhost:5432/nextgen_db"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-byte-secret

# Encryption (generate with setup-auth.sh)
ENCRYPTION_KEY=64-character-hex-key
HASH_SALT=random-salt-here

# OAuth (optional)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

**자동 생성**: `./scripts/setup-auth.sh` 실행

---

## 개발 가이드

### 컨텍스트 로딩 전략

작업 시작 전 필요한 문서만 로드:

```
대시보드 개발 → ARCHITECTURE.md + docs/features/dashboard.md
CRM 개발 → ARCHITECTURE.md + docs/features/crm.md
```

**전체 명세 로드 금지** → 토큰 86% 절약

### 디자인 시스템

1. **Stitch MCP** (우선) - 실시간 디자인 시스템
2. **DESIGN_SYSTEM.md** (백업) - 오프라인 참고용

### 코드 규칙

- **파일명**: kebab-case
- **컴포넌트**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE

자세한 내용: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 문서

| 문서 | 설명 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 기술 스택 & 아키텍처 패턴 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Stitches 디자인 시스템 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | 제품 명세 구조 가이드 |
| [DATABASE.md](./DATABASE.md) | 데이터베이스 ERD & 스키마 |
| [docs/auth-system.md](./docs/auth-system.md) | 인증 시스템 상세 문서 |
| [docs/features/](./docs/features/) | 14개 기능 모듈 명세 |

---

## 로드맵

### Phase 1: MVP (현재 - 3개월)
- ✅ 인증 시스템
- ✅ 데이터베이스 스키마
- 🚧 대시보드 & 분석
- 🚧 프로젝트 관리
- 🚧 장비·자산 관리
- 🚧 스케줄링 & 배치

### Phase 2: Core Business (6개월)
- CRM & 고객 관리
- 견적 & 계약 관리
- 회계·청구·인보이싱
- 인력·크루 관리
- 유지보수 & 서비스
- 통합 & 확장성

### Phase 3: AI & Advanced (9개월)
- 운송·물류 (TMS)
- AI 예측 시스템
- AI 실시간 현장 안전
- 보고서 & 컴플라이언스

---

## 기여

프로젝트에 기여하려면:

1. 브랜치 생성: `git checkout -b feature/your-feature`
2. 변경사항 커밋: `git commit -m 'Add some feature'`
3. 브랜치 푸시: `git push origin feature/your-feature`
4. Pull Request 생성

---

## 라이선스

Proprietary - KMTLS Heavy Lifting Co.

---

## 연락처

- **프로젝트**: KMTLS Next-Gen
- **버전**: 0.1.0 (MVP)
- **관리자**: KMTLS 개발팀

---

**Last Updated**: 2026-03-24

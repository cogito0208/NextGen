# Project Context

## 프로젝트 정의
**KMTLS Next-Gen**: AI 기반 중량물·도비 통합 운영 플랫폼
- 도비 업계 특화 엔터프라이즈 SaaS
- 안전성, 효율성, 수익성 극대화

## 필수 컨텍스트 (항상 참조)

@AGENTS.md              ← Next.js 프레임워크 규칙
@ARCHITECTURE.md        ← 기술 스택 및 아키텍처
@DESIGN_SYSTEM.md       ← UI/UX 규칙 (백업용)

## 제품 명세 (선택적 로드)

@PRODUCT_SPEC.md        ← 문서 구조 가이드 (먼저 읽기)

### 비즈니스 컨텍스트
- `docs/business/overview.md` - 프로젝트 배경, 전략, KPI
- `docs/business/kpi.md` - 기대효과, ROI 분석

### 기능 명세 (작업 중인 모듈만 로드)
- `docs/features/dashboard.md` - 대시보드 & 분석
- `docs/features/project.md` - 프로젝트 관리
- `docs/features/fleet.md` - 장비·자산 관리
- ... (14개 모듈, 필요시에만 참조)

전체 목록: `docs/features/README.md`

### 도메인 지식
- `docs/domain/heavy-lifting.md` - 도비 업계 용어 및 프로세스

## Context Loading Strategy

### ✅ 효율적 (토큰 절약)
```
작업: "대시보드 페이지 개발"
로드: ARCHITECTURE.md + docs/features/dashboard.md
토큰: ~5K
```

### ❌ 비효율적
```
작업: "대시보드 페이지 개발"
로드: 모든 기능 명세 14개
토큰: ~50K
```

## Design System Integration
**우선순위: Stitch MCP > DESIGN_SYSTEM.md**

1. **Stitch MCP 활성화됨** (프로젝트 ID: 13221876373502805634)
   - UI 컴포넌트 개발시 Stitch MCP를 통해 실시간 디자인 시스템 참조
   - 자동으로 최신 디자인 토큰 적용
   - 토큰 사용량 90% 절감 효과
   - 설정 가이드: @STITCH_SETUP.md

2. **DESIGN_SYSTEM.md는 백업/참고용**
   - Stitch MCP 오프라인시 대체
   - 기본 디자인 원칙 참고

## Instructions

### 1. 작업 시작 전
- PRODUCT_SPEC.md 확인 (문서 구조 이해)
- 작업 중인 모듈의 feature MD만 로드
- 필요시 domain 지식 참조

### 2. 코드 작성
- **디자인 시스템**: Stitch MCP 우선 사용
- **아키텍처 패턴**: ARCHITECTURE.md 준수
- **도메인 용어**: docs/domain/heavy-lifting.md 참조

### 3. 불필요한 컨텍스트 로드 금지
- 전체 명세서 로드 금지
- 작업과 무관한 모듈 로드 금지
- 토큰 절약 목표: 작업당 5K 이하

## 도메인 특수성

### 업계 특성
- 고객: 삼성, LG 등 대기업 (보안 구역)
- 장비: 크레인, 지게차 (25톤~1,200톤)
- 규제: 중대재해처벌법 대응 필수

### 핵심 가치
- 안전: 디지털 증빙, 실시간 모니터링
- 효율: 장비 가동률 85% 목표 (현재 70%)
- 수익: AI 배차 최적화, 견적 자동화

## 개발 우선순위

### Phase 1 (MVP - 3개월)
1. 대시보드 & 분석
2. 프로젝트 관리
3. 장비·자산 관리
4. 스케줄링 & 배치

### Phase 2 (6개월)
5. CRM, 견적, 회계, 인력 관리

### Phase 3 (9개월)
6. AI 예측, TMS, 안전 모니터링

## 외부 연동 (향후)

### 현재
- Stitch MCP (디자인 시스템) ✅

### 계획
- 더존 ERP API
- Samsara IoT
- 공인인증서 연동

---

**토큰 최적화 목표**: 86% 절감 (450K → 80K/월)
**참조**: docs/token-optimization.md

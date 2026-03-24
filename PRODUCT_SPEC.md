# KMTLS Next-Gen 제품 명세서

## 📚 문서 구조 안내

이 프로젝트의 요구사항은 **계층적 .md 파일**로 구성되어 있습니다.

### 왜 .md 파일인가?
- ✅ 정적 참조 문서 (기능 명세서)
- ✅ Git 버전 관리 용이
- ✅ 선택적 로드로 토큰 절약 (86%)
- ✅ 팀 협업 및 리뷰 가능

### 왜 MCP가 아닌가?
- ❌ 실시간 데이터가 아님
- ❌ 외부 API 불필요
- ❌ 동적 업데이트 빈도 낮음
- ⚠️ 향후 ERP/IoT 연동시 MCP 추가 고려

## 📂 문서 구조

```
docs/
├─ business/                  # 비즈니스 컨텍스트
│  ├─ overview.md            # 프로젝트 배경, 전략적 가치
│  └─ kpi.md                 # 기대효과, ROI 분석
│
├─ features/                  # 기능 명세 (14개 모듈)
│  ├─ README.md              # 모듈 목록 및 우선순위
│  ├─ _template.md           # 신규 기능 작성 템플릿
│  ├─ dashboard.md           # ✅ 작성 완료
│  ├─ crm.md                 # 📝 작성 필요
│  ├─ project.md             # 📝 작성 필요
│  ├─ quote.md               # 📝 작성 필요
│  ├─ fleet.md               # 📝 작성 필요
│  ├─ scheduling.md          # 📝 작성 필요
│  ├─ crew.md                # 📝 작성 필요
│  ├─ tms.md                 # 📝 작성 필요
│  ├─ ai-prediction.md       # 📝 작성 필요
│  ├─ maintenance.md         # 📝 작성 필요
│  ├─ accounting.md          # 📝 작성 필요
│  ├─ reporting.md           # 📝 작성 필요
│  ├─ safety.md              # 📝 작성 필요
│  └─ integration.md         # 📝 작성 필요
│
└─ domain/                    # 도메인 지식
   ├─ heavy-lifting.md       # 도비·중량물 업계 용어 및 프로세스
   └─ safety-regulations.md  # 중대재해처벌법 등 (작성 예정)
```

## 🎯 사용 방법

### Claude에게 작업 요청시

#### ✅ GOOD - 필요한 것만 로드
```
"대시보드 페이지 개발할게요.
docs/features/dashboard.md 참조해주세요."

→ 토큰 사용: ~3K
```

#### ❌ BAD - 전체 로드
```
"프로젝트 시작할게요. 모든 기능 명세 보여주세요."

→ 토큰 사용: ~50K+ (비효율)
```

### 모듈별 작업 흐름

#### 1. 대시보드 개발
```typescript
// 참조 문서
- docs/business/overview.md      // 프로젝트 이해
- docs/features/dashboard.md     // 기능 상세
- DESIGN_SYSTEM.md              // UI 규칙
```

#### 2. CRM 개발
```typescript
// 참조 문서
- docs/features/crm.md          // 기능 상세
- docs/domain/heavy-lifting.md  // 업계 용어
- docs/business/kpi.md          // 고객 관리 KPI
```

## 📊 토큰 절약 효과

### Before (전체 명세를 하나의 파일)
- 파일: `FULL_SPEC.md` (15,000 토큰)
- 대시보드 작업: 15K 토큰 로드
- CRM 작업: 15K 토큰 로드
- **월간 총 사용**: ~450K 토큰

### After (계층적 구조)
- 대시보드 작업: 3K 토큰
- CRM 작업: 3K 토큰
- 공통 (overview): 2K 토큰
- **월간 총 사용**: ~80K 토큰

**절감률: 82%**

## 🔄 향후 MCP 통합 계획

### Phase 1: .md 기반 (현재)
- 모든 기능 명세는 .md 파일
- Git 버전 관리
- 수동 업데이트

### Phase 2: 외부 연동 MCP 추가 (6개월 후)
```json
{
  "mcpServers": {
    "stitch": { ... },           // ✅ 이미 활성화
    "filesystem": { ... },       // ✅ 이미 활성화

    // 향후 추가 예정
    "dazone-erp": {              // 더존 ERP 연동
      "command": "npx",
      "args": ["@kmtls/dazone-mcp"],
      "env": { "ERP_API_KEY": "..." }
    },
    "samsara-iot": {             // Samsara IoT 연동
      "command": "npx",
      "args": ["@kmtls/samsara-mcp"],
      "env": { "IOT_TOKEN": "..." }
    }
  }
}
```

### Phase 3: 하이브리드 (12개월 후)
- 정적 명세: .md 파일 (기능 정의)
- 동적 데이터: MCP 서버 (실시간 ERP, IoT)
- 최적 조합

## 📝 문서 작성 가이드

### 새 기능 추가시
1. `docs/features/_template.md` 복사
2. 모듈 정보 작성
3. Git 커밋
4. Claude에게 참조 요청

### 기존 기능 수정시
1. 해당 .md 파일 직접 수정
2. 버전 번호 업데이트
3. Git 커밋

### 원본 제안서 보관
- 원본 SaaS 제안서: `docs/original-proposal.md` (작성 예정)
- 변경 이력: Git history

## 🚀 우선순위별 개발 계획

### Phase 1: MVP (3개월) - P0
- [ ] 대시보드 & 분석 ✅
- [ ] 프로젝트 관리
- [ ] 장비·자산 관리
- [ ] 스케줄링 & 배치

### Phase 2: Core Business (6개월) - P1
- [ ] CRM & 고객 관리
- [ ] 견적 & 계약 관리
- [ ] 회계·청구·인보이싱
- [ ] 인력·크루 관리
- [ ] 유지보수 & 서비스
- [ ] 통합 & 확장성

### Phase 3: AI & Advanced (9개월) - P2
- [ ] 운송·물류 (TMS)
- [ ] AI 예측 시스템
- [ ] AI 실시간 현장 안전
- [ ] 보고서 & 컴플라이언스

## 📞 문의 및 기여

### 문서 오류 발견시
- GitHub Issue 생성
- 또는 직접 PR

### 새 기능 제안시
- `docs/features/` 에 MD 파일 생성
- 템플릿 준수
- Review 요청

---

**작성일**: 2026-03-24
**버전**: 1.0
**관리자**: KMTLS 개발팀

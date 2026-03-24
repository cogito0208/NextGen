# 토큰 최적화 전략

## 개요
기업용 SaaS 개발시 Claude를 효율적으로 사용하기 위한 토큰 절약 전략

## 1. MD 파일 계층 구조

### 레벨 1: 항상 로드 (필수 컨텍스트)
```
CLAUDE.md           ← 진입점
├─ AGENTS.md        ← Next.js 프레임워크 규칙
├─ ARCHITECTURE.md  ← 전체 아키텍처
└─ DESIGN_SYSTEM.md ← Stitch 디자인 시스템
```
**토큰**: ~2-3K

### 레벨 2: 작업별 선택 로드
```
docs/
├─ components.md    ← 컴포넌트 작업시
├─ api.md          ← API 개발시
├─ database.md     ← DB 작업시
├─ auth.md         ← 인증 작업시
└─ deployment.md   ← 배포 작업시
```
**토큰**: 작업당 1-2K (필요시만)

### 레벨 3: 기능별 세부 컨텍스트
```
src/features/{feature}/CONTEXT.md
```
**토큰**: 기능당 500-1K (해당 기능 작업시만)

## 2. 컨텍스트 로딩 패턴

### ✅ 효율적인 패턴
```
사용자: "로그인 버튼 컴포넌트 만들어줘"
Claude: CLAUDE.md → DESIGN_SYSTEM.md → docs/components.md 읽기
총 토큰: ~4K
```

### ❌ 비효율적인 패턴
```
사용자: "로그인 버튼 컴포넌트 만들어줘"
Claude: 모든 MD 파일 + 전체 코드베이스 읽기
총 토큰: ~50K+
```

## 3. MCP 서버 최적화

### 기본 활성화 (최소 구성)
```json
{
  "filesystem": {
    "args": ["...", "./src", "./docs"]
  }
}
```

### 작업별 추가 활성화
| 작업 유형 | 추가 MCP 서버 | 토큰 영향 |
|---------|-------------|----------|
| 컴포넌트 개발 | - | 최소 |
| API 개발 | fetch | +1K |
| DB 마이그레이션 | postgres | +2K |
| GitHub 연동 | github | +1K |

## 4. 파일 구조 최적화

### DO
```
src/
├─ components/
│  └─ ui/
│     └─ button.tsx          ← 단일 책임
├─ features/
│  └─ auth/
│     ├─ CONTEXT.md          ← 기능별 컨텍스트
│     └─ login-form.tsx
```

### DON'T
```
src/
├─ everything.ts             ← 거대한 단일 파일
└─ utils.ts                  ← 모든 유틸리티
```

**이유**: 거대한 파일은 불필요한 컨텍스트 로드 유발

## 5. 명명 규칙으로 검색 최적화

### 파일명 패턴
```
{domain}-{type}.tsx

예시:
user-profile-card.tsx
invoice-table-view.tsx
payment-form-modal.tsx
```

**장점**: Claude가 정확한 파일을 빠르게 검색 가능

### 컴포넌트 주석 (선택적)
```tsx
/**
 * @component UserProfileCard
 * @domain user-management
 * @design-system Stitch
 */
export function UserProfileCard() {}
```

## 6. 문서 작성 원칙

### 간결성 우선
```markdown
❌ BAD (장황함):
"이 컴포넌트는 사용자의 프로필 정보를 표시하는데 사용되며,
다양한 상황에서 재사용 가능하도록 설계되었습니다..."

✅ GOOD (핵심만):
"사용자 프로필 표시 컴포넌트"
```

### 코드 예시 포함
```markdown
✅ GOOD:
## Button 사용법
\`\`\`tsx
<Button variant="primary" size="md">Click</Button>
\`\`\`

❌ BAD:
"버튼 컴포넌트는 variant와 size prop을 받습니다.
variant는 primary, secondary 등이 있고..."
```

## 7. 실시간 컨텍스트 관리

### 세션 시작시
```
"이번 작업은 로그인 기능 개발입니다.
필요한 컨텍스트: docs/auth.md, src/features/auth/CONTEXT.md"
```

### 작업 전환시
```
"이제 결제 기능으로 전환합니다.
이전 컨텍스트는 잊고, docs/billing.md만 참조해주세요."
```

## 8. 측정 및 모니터링

### 토큰 사용량 체크
- 각 대화 세션 후 토큰 사용량 확인
- 목표: 일반 작업당 5K 이하

### 경고 신호
- 단일 응답에 10K+ 토큰 사용
- 불필요한 파일 다중 읽기
- 중복 컨텍스트 로드

## 예상 효과

### Before (비최적화)
- 컴포넌트 1개 생성: ~20K 토큰
- API 엔드포인트 1개: ~30K 토큰
- 월 예상 비용: $150+

### After (최적화)
- 컴포넌트 1개 생성: ~5K 토큰
- API 엔드포인트 1개: ~8K 토큰
- 월 예상 비용: $40-50

**절감률**: 약 70%

## 체크리스트

작업 시작 전:
- [ ] 필요한 컨텍스트 파일만 선택했는가?
- [ ] MCP 서버가 최소 구성인가?
- [ ] 작업 범위가 명확한가?

작업 중:
- [ ] 불필요한 파일 읽기를 피하는가?
- [ ] 중복 질문을 하지 않는가?

작업 후:
- [ ] 토큰 사용량이 예상 범위인가?
- [ ] 새로운 CONTEXT.md가 필요한가?

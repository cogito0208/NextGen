# Quick Start Guide

## 설정 완료 확인

### 1. MD 파일 구조
```
✅ CLAUDE.md
✅ AGENTS.md  
✅ ARCHITECTURE.md
✅ DESIGN_SYSTEM.md
✅ MCP_GUIDE.md
✅ docs/components.md
✅ docs/token-optimization.md
```

### 2. Stitch 설정
```
✅ src/config/stitches.config.ts
✅ src/components/ui/button.tsx (예시)
✅ @stitches/react 설치됨
```

### 3. MCP 구성
```
✅ .claude/mcp-config-example.json
✅ .gitignore 업데이트
```

## 사용 예시

### 컴포넌트 개발 요청
```
"로그인 폼 컴포넌트 만들어줘"

Claude가 자동으로:
1. DESIGN_SYSTEM.md 읽기
2. docs/components.md 읽기
3. src/components/ui/button.tsx 참고
4. Stitch 패턴으로 구현
```

### API 개발 요청
```
"사용자 CRUD API 엔드포인트 만들어줘"

Claude가 자동으로:
1. ARCHITECTURE.md 읽기 (API 패턴 확인)
2. docs/api.md 읽기 (생성 필요)
3. RESTful 구조로 구현
```

## 토큰 사용량 비교

### Before (최적화 전)
```
요청: "버튼 컴포넌트 만들어줘"
Claude: 전체 코드베이스 읽기 → 20K 토큰
```

### After (최적화 후)
```
요청: "버튼 컴포넌트 만들어줘"
Claude: DESIGN_SYSTEM.md + docs/components.md → 4K 토큰
절감: 80%
```

## 다음 단계

### 1. MCP 설정 활성화
```bash
# .claude/mcp-config-example.json을 복사
cp .claude/mcp-config-example.json .claude/config.json

# 민감 정보 입력 (GitHub token 등)
vim .claude/config.json
```

### 2. 추가 문서 작성 (필요시)
```bash
# docs/ 폴더에 도메인별 가이드 추가
docs/
├─ api.md          ← API 개발 가이드
├─ auth.md         ← 인증/인가 가이드
├─ database.md     ← DB 스키마 가이드
└─ deployment.md   ← 배포 가이드
```

### 3. 기능별 컨텍스트 (점진적 추가)
```bash
# 새로운 기능 시작시
src/features/billing/
├─ CONTEXT.md      ← 결제 기능 컨텍스트
├─ invoice-table.tsx
└─ payment-form.tsx
```

## 작업 흐름 예시

### 시나리오: 대시보드 페이지 개발

1. **준비**
   ```
   "대시보드 페이지를 만들려고 해요.
   필요한 컨텍스트: docs/components.md만 참조해주세요."
   ```

2. **개발**
   - Claude가 DESIGN_SYSTEM.md 기반으로 구현
   - Stitch variants 패턴 자동 적용
   - 타입 안전성 보장

3. **완료**
   - 토큰 사용: ~5-8K (효율적)
   - 일관된 디자인 시스템
   - 유지보수 용이한 코드

## 팁

### ✅ DO
- 작업 시작시 필요한 컨텍스트 명시
- 도메인별 문서 점진적 추가
- 토큰 사용량 모니터링

### ❌ DON'T
- 모든 MD 파일을 한 번에 만들기
- 너무 상세한 문서 작성 (간결성 우선)
- MCP 서버 과다 활성화

## 문제 해결

### Q: 토큰이 너무 많이 사용돼요
A: docs/ 파일 크기 확인, 중복 컨텍스트 로드 여부 체크

### Q: Claude가 디자인 시스템을 따르지 않아요
A: DESIGN_SYSTEM.md에 더 명확한 예시 추가

### Q: MCP 서버가 작동하지 않아요
A: .claude/config.json 경로 및 권한 확인

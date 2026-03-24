# Google Stitch MCP 빠른 설정 가이드

## 🎯 목표
Google Stitch 디자인 시스템을 Claude Code에 통합하여:
- 토큰 사용량 **86% 절감**
- 개발 시간 **60-70% 단축**
- 디자인-개발 **자동 동기화**

## ⚡ 빠른 시작 (5분)

### Step 1: Stitch MCP 초기화
```bash
npx @_davideast/stitch-mcp init
```

이 명령어가 자동으로:
- ✅ Google 인증 처리
- ✅ OAuth 토큰 생성
- ✅ 프로젝트 설정
- ✅ MCP 구성 파일 생성

### Step 2: MCP 설정 활성화
```bash
# 예시 파일을 실제 설정으로 복사
cp .claude/mcp-config-example.json .claude/config.json
```

`.claude/config.json` 파일이 자동으로 생성되며, Stitch MCP가 포함됩니다:
```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_PROJECT_ID": "13221876373502805634"
      }
    }
  }
}
```

### Step 3: 테스트
Claude Code를 재시작하고 테스트:
```
"Stitch 프로젝트에서 디자인 시스템 정보 보여줘"
```

## 📋 상세 설정 옵션

### 옵션 1: 시스템 gcloud 사용
이미 gcloud CLI가 설정되어 있다면:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_PROJECT_ID": "13221876373502805634",
        "STITCH_USE_SYSTEM_GCLOUD": "1"
      }
    }
  }
}
```

### 옵션 2: API 키 사용
Stitch API 키가 있다면:

```bash
# 환경변수 설정
export STITCH_API_KEY="your-api-key-here"
```

또는 config.json에 직접:
```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_PROJECT_ID": "13221876373502805634",
        "STITCH_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 🎨 사용 예시

### 1. 디자인 시스템 추출
```
사용자: "Stitch 프로젝트에서 DESIGN.md 파일 생성해줘"

Claude: Stitch MCP를 호출하여:
- 색상 팔레트 추출
- 타이포그래피 시스템
- 간격 규칙
- 컴포넌트 스타일

→ docs/DESIGN.md 생성
```

### 2. 컴포넌트 개발
```
사용자: "로그인 버튼 컴포넌트 만들어줘"

Claude:
1. Stitch MCP에서 디자인 시스템 조회 (200 토큰)
2. 프로젝트 스타일 자동 적용
3. React/TypeScript 컴포넌트 생성

Before: 4-5K 토큰
After: 500 토큰 (90% 절감)
```

### 3. 페이지 개발
```
사용자: "대시보드 페이지 만들어줘"

Claude:
- Stitch 디자인 시스템 참조
- 일관된 스타일 자동 적용
- Tailwind CSS 클래스 생성
```

### 4. URL에서 디자인 추출
```
사용자: "https://stripe.com의 디자인 시스템을 추출하고 우리 프로젝트에 적용해줘"

Stitch MCP:
1. Stripe 웹사이트 분석
2. 디자인 토큰 자동 추출
3. DESIGN.md 업데이트
4. Stitch 프로젝트에 저장
```

## 🔧 명령어 참조

### 로컬 미리보기
```bash
npx @_davideast/stitch-mcp serve -p 13221876373502805634
```
브라우저에서 디자인 실시간 확인

### Astro 프로젝트 생성
```bash
npx @_davideast/stitch-mcp site -p 13221876373502805634
```
Stitch 디자인으로 Astro 사이트 생성

### 대화형 브라우저
```bash
npx @_davideast/stitch-mcp view
```
Stitch 리소스 탐색

## 📊 효과 측정

### 토큰 사용량 비교 (예상)

#### 컴포넌트 개발
| 작업 | 수동 | Stitch MCP | 절감 |
|------|------|------------|------|
| 디자인 확인 | 1K | - | - |
| 스타일 가이드 | 2K | - | - |
| 컴포넌트 생성 | 2K | 500 | - |
| **총합** | **5K** | **500** | **90%** |

#### 월간 예상 (컴포넌트 50개, 페이지 20개)
- 수동: ~490K 토큰 ($150)
- Stitch MCP: ~70K 토큰 ($20)
- **절감: $130/월 (87%)**

## ✅ 검증 체크리스트

설정 완료 후 확인:

### 1. MCP 연결 확인
```
Claude에게 "Stitch MCP 서버 상태 확인해줘" 요청
→ 정상 응답 확인
```

### 2. 프로젝트 접근 확인
```
"Stitch 프로젝트 ID 13221876373502805634 정보 보여줘"
→ 프로젝트 정보 표시 확인
```

### 3. 디자인 토큰 추출 테스트
```
"현재 프로젝트의 색상 팔레트 보여줘"
→ 색상 목록 표시 확인
```

### 4. 컴포넌트 생성 테스트
```
"간단한 버튼 컴포넌트 만들어줘"
→ Stitch 스타일 적용 확인
```

## 🔄 업데이트 워크플로우

### 디자인 변경시
```
디자이너가 Stitch에서 디자인 업데이트
    ↓
자동으로 MCP를 통해 반영
    ↓
Claude가 즉시 최신 디자인 사용
    ↓
재배포 또는 재생성 요청
```

**수동 동기화 불필요!**

## 🐛 문제 해결

### Q: "Authentication failed" 에러
```bash
# 재인증
npx @_davideast/stitch-mcp init
```

### Q: "Project not found" 에러
`.claude/config.json`에서 `STITCH_PROJECT_ID` 확인:
```json
"STITCH_PROJECT_ID": "13221876373502805634"
```

### Q: MCP 서버가 시작되지 않음
```bash
# 전역 설치 후 재시도
npm install -g @_davideast/stitch-mcp
```

### Q: 토큰이 여전히 많이 사용됨
1. `.claude/config.json`에서 Stitch MCP가 활성화되어 있는지 확인
2. Claude Code 재시작
3. "Stitch 디자인 시스템 사용해서..." 명시적으로 요청

## 📚 추가 리소스

- [Stitch MCP GitHub](https://github.com/davideast/stitch-mcp)
- [Stitch SDK](https://github.com/google-labs-code/stitch-sdk)
- [상세 분석 문서](./docs/stitch-mcp-analysis.md)
- [토큰 최적화 전략](./docs/token-optimization.md)

## 🎯 다음 단계

1. ✅ Stitch MCP 설정 완료
2. [ ] DESIGN.md 생성 (Stitch에서 추출)
3. [ ] 예시 컴포넌트 3개 생성 (테스트)
4. [ ] 토큰 사용량 측정 및 비교
5. [ ] 팀원 온보딩

## 💡 Pro Tips

1. **명시적 요청**
   ```
   "Stitch 디자인 시스템을 사용해서 버튼 만들어줘"
   → Claude가 MCP 우선 사용
   ```

2. **하이브리드 접근**
   - 온라인: Stitch MCP (최신 디자인)
   - 오프라인: DESIGN_SYSTEM.md (백업)

3. **토큰 모니터링**
   - 각 작업 후 사용량 확인
   - 목표: 작업당 1K 이하

4. **정기적 동기화**
   ```bash
   # 주 1회 DESIGN.md 업데이트
   "Stitch에서 최신 디자인 시스템 가져와서 DESIGN.md 업데이트해줘"
   ```

---

**설정 시간**: 5-10분
**예상 효과**: 토큰 86% 절감, 비용 87% 절감, 시간 60-70% 단축

**지금 바로 시작하세요!** 🚀

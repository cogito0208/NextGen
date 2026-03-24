# MCP (Model Context Protocol) 구성 가이드

## 개요
MCP를 통해 Claude가 외부 도구/데이터에 접근할 수 있습니다.
**토큰 절약** 관점에서 필수 서버만 활성화하고, 필요시 동적으로 활성화합니다.

## 권장 MCP 서버 (기업용 SaaS)

### 🔹 항상 활성화
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "./"],
    "description": "코드베이스 탐색"
  }
}
```

### 🔸 필요시 활성화

**데이터베이스 작업시**:
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."],
    "description": "스키마 확인/마이그레이션"
  }
}
```

**GitHub 연동 작업시**:
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "..." }
  }
}
```

**환경변수 관리시**:
```json
{
  "env": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-env"],
    "description": ".env 파일 관리"
  }
}
```

**외부 API 테스트시**:
```json
{
  "fetch": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-fetch"],
    "description": "HTTP 요청 테스트"
  }
}
```

## 토큰 절약 전략

### ✅ DO
1. **필요한 서버만 활성화**
   - 작업 종류에 따라 동적으로 켜고 끄기
   - 예: DB 마이그레이션 작업시만 postgres 서버 활성화

2. **파일시스템 서버 경로 제한**
   ```json
   ["@modelcontextprotocol/server-filesystem", "./src"]
   ```
   - 전체 프로젝트 대신 src만 접근

3. **캐싱 활용**
   - MCP 서버 응답은 자동 캐싱됨
   - 반복 질문시 토큰 절약

### ❌ DON'T
1. 모든 MCP 서버를 동시에 활성화
2. 너무 넓은 범위(entire disk) 파일시스템 접근
3. 불필요한 외부 API 서버 활성화

## 사용 예시

### 시나리오 1: 컴포넌트 개발
**활성화**: filesystem (src/components만)
**이유**: 로컬 파일 탐색만 필요

### 시나리오 2: API 통합 개발
**활성화**: filesystem, fetch
**이유**: 코드 작성 + 외부 API 테스트

### 시나리오 3: DB 스키마 변경
**활성화**: filesystem, postgres
**이유**: 코드 + DB 스키마 동시 참조

## 설정 파일 위치

### 글로벌 설정
```
~/.config/claude/config.json
```

### 프로젝트별 설정
```
/Users/haeyoung/kmtls/nextgen/.claude/config.json
```

**권장**: 프로젝트별 설정 사용 (팀 공유 가능)

## 보안 주의사항

1. **환경변수 외부 노출 금지**
   - `.claude/config.json`을 `.gitignore`에 추가
   - 예시 파일은 `mcp-config-example.json`로 커밋

2. **최소 권한 원칙**
   - DB는 읽기 전용 사용자 권장
   - GitHub는 필요한 scope만 부여

## 실제 구성 예시 (이 프로젝트)

```json
{
  "mcpServers": {
    "project-files": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/haeyoung/kmtls/nextgen/src",
        "/Users/haeyoung/kmtls/nextgen/docs"
      ],
      "description": "src와 docs만 접근"
    }
  }
}
```

이렇게 하면 불필요한 node_modules, .next 등의 컨텍스트 로드를 방지합니다.

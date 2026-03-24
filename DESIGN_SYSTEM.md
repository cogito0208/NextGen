# Stitch Design System Guidelines

## Overview
이 프로젝트는 Stitches CSS-in-JS 라이브러리를 사용합니다.

## Core Principles
- 타입 안전한 디자인 토큰 사용
- 컴포넌트 variants로 스타일 변형 관리
- 반응형은 breakpoints 기반

## Design Tokens Location
`src/config/stitches.config.ts` - 모든 디자인 토큰 정의

## Component Pattern

```tsx
import { styled } from '@/config/stitches.config';

export const Button = styled('button', {
  // base styles
  variants: {
    size: { sm: {}, md: {}, lg: {} },
    variant: { primary: {}, secondary: {} }
  },
  defaultVariants: { size: 'md', variant: 'primary' }
});
```

## Color Tokens
- Primary: 브랜드 메인 컬러
- Neutral: 텍스트 및 배경
- Semantic: success, error, warning, info

## Spacing Scale
4px 기반 (1 = 4px, 2 = 8px, ..., 16 = 64px)

## Typography
- Heading: h1~h6
- Body: body1, body2
- Caption

## DO
- variants로 스타일 분기 처리
- 디자인 토큰 사용 (하드코딩 금지)
- 컴포넌트 합성 (composition) 우선

## DON'T
- inline style 사용 금지
- 임의의 색상/간격 값 사용 금지
- 중복 컴포넌트 생성 금지

# Component Guidelines

## Component Types

### 1. UI Components (`src/components/ui/`)
기본 디자인 시스템 컴포넌트 - 재사용성 최우선

**Examples**: Button, Input, Card, Modal, Dropdown

**Rules**:
- Props는 최소한으로 유지
- Stitch variants 활용
- 비즈니스 로직 포함 금지
- Storybook 문서화 필수

```tsx
// src/components/ui/button.tsx
import { styled } from '@/config/stitches.config';

export const Button = styled('button', {
  // base styles
  borderRadius: '$md',
  fontWeight: '$medium',

  variants: {
    size: {
      sm: { px: '$3', py: '$2', fontSize: '$sm' },
      md: { px: '$4', py: '$3', fontSize: '$base' },
      lg: { px: '$6', py: '$4', fontSize: '$lg' }
    },
    variant: {
      primary: { bg: '$primary', color: 'white' },
      secondary: { bg: '$neutral200', color: '$neutral900' }
    }
  },

  defaultVariants: {
    size: 'md',
    variant: 'primary'
  }
});
```

### 2. Feature Components (`src/components/features/`)
비즈니스 로직이 포함된 복합 컴포넌트

**Examples**: UserProfileCard, InvoiceTable, TeamSelector

**Rules**:
- UI 컴포넌트 조합하여 구성
- 데이터 fetching 포함 가능
- 도메인 로직 캡슐화

```tsx
// src/components/features/user-profile-card.tsx
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user';

export function UserProfileCard({ userId }: { userId: string }) {
  const { data: user } = useUser(userId);

  return (
    <Card>
      <Avatar src={user?.avatar} />
      {/* ... */}
    </Card>
  );
}
```

## File Structure

```
components/
├─ ui/
│  ├─ button.tsx
│  ├─ input.tsx
│  └─ card.tsx
└─ features/
   ├─ billing/
   │  ├─ invoice-table.tsx
   │  └─ payment-form.tsx
   └─ team/
      ├─ team-selector.tsx
      └─ member-list.tsx
```

## Naming Conventions
- 파일: `kebab-case.tsx`
- 컴포넌트: `PascalCase`
- Props 타입: `{ComponentName}Props`

## Props Pattern

```tsx
// ✅ GOOD - 명시적 타입
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, onClick, disabled }: ButtonProps) {
  // ...
}

// ❌ BAD - any 타입
export function Button(props: any) {
  // ...
}
```

## Composition over Configuration

```tsx
// ✅ GOOD - 합성
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// ❌ BAD - 과도한 props
<Card
  title="Title"
  content="Content"
  showHeader={true}
  headerAlign="left"
/>
```

## Server vs Client Components

```tsx
// Server Component (기본)
export function ServerCard({ data }: Props) {
  return <div>{data}</div>;
}

// Client Component (상호작용 필요시)
'use client';

export function InteractiveCard({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return <div onClick={() => setIsOpen(!isOpen)}>{data}</div>;
}
```

## Testing
- Unit: Jest + Testing Library
- E2E: Playwright
- 최소 70% 커버리지 유지

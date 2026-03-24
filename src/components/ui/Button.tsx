import { styled } from '@/config/stitches.config';

/**
 * @component Button
 * @design-system Stitch
 * @domain ui
 *
 * 기본 버튼 컴포넌트 - 재사용 가능한 UI 요소
 * DESIGN_SYSTEM.md 규칙 준수
 */
export const Button = styled('button', {
  // Reset & Base
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  cursor: 'pointer',
  userSelect: 'none',
  fontFamily: '$sans',
  fontWeight: '$medium',
  borderRadius: '$md',
  transition: 'all $fast',

  // Disabled state
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Focus state
  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '2px',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        '&:hover:not(:disabled)': {
          backgroundColor: '$primaryHover',
        },
      },
      secondary: {
        backgroundColor: '$neutral200',
        color: '$neutral900',
        '&:hover:not(:disabled)': {
          backgroundColor: '$neutral300',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: '$primary',
        border: '1px solid $primary',
        '&:hover:not(:disabled)': {
          backgroundColor: '$primaryLight',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$neutral700',
        '&:hover:not(:disabled)': {
          backgroundColor: '$neutral100',
        },
      },
    },
    size: {
      sm: {
        px: '$3',
        py: '$2',
        fontSize: '$sm',
        gap: '$2',
      },
      md: {
        px: '$4',
        py: '$3',
        fontSize: '$base',
        gap: '$2',
      },
      lg: {
        px: '$6',
        py: '$4',
        fontSize: '$lg',
        gap: '$3',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Type export for TypeScript
export type ButtonProps = React.ComponentProps<typeof Button>;

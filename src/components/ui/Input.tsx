import { styled } from '@/config/stitches.config';
import { ComponentProps } from 'react';

/**
 * @component Input
 * @design-system Stitch
 * @domain ui
 */
export const Input = styled('input', {
  // Reset
  all: 'unset',
  boxSizing: 'border-box',
  
  // Base styles
  width: '100%',
  fontFamily: '$sans',
  fontSize: '$base',
  lineHeight: '$normal',
  color: '$text',
  backgroundColor: '$background',
  border: '1px solid $neutral300',
  borderRadius: '$md',
  px: '$4',
  py: '$3',
  transition: 'all $fast',

  // Placeholder
  '&::placeholder': {
    color: '$textMuted',
  },

  // States
  '&:hover:not(:disabled)': {
    borderColor: '$neutral400',
  },

  '&:focus': {
    borderColor: '$primary',
    outline: '2px solid $primaryLight',
    outlineOffset: '0',
  },

  '&:disabled': {
    backgroundColor: '$neutral100',
    color: '$textMuted',
    cursor: 'not-allowed',
  },

  '&[aria-invalid="true"]': {
    borderColor: '$error',
    '&:focus': {
      outline: '2px solid rgba(239, 68, 68, 0.2)',
    },
  },

  variants: {
    size: {
      sm: {
        fontSize: '$sm',
        px: '$3',
        py: '$2',
      },
      md: {
        fontSize: '$base',
        px: '$4',
        py: '$3',
      },
      lg: {
        fontSize: '$lg',
        px: '$5',
        py: '$4',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {
        width: 'auto',
      },
    },
  },

  defaultVariants: {
    size: 'md',
    fullWidth: true,
  },
});

export type InputProps = ComponentProps<typeof Input>;

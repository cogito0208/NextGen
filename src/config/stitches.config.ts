import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Primary
      primary: '#0070f3',
      primaryHover: '#0051cc',
      primaryLight: '#e6f2ff',

      // Neutral
      neutral50: '#fafafa',
      neutral100: '#f5f5f5',
      neutral200: '#e5e5e5',
      neutral300: '#d4d4d4',
      neutral400: '#a3a3a3',
      neutral500: '#737373',
      neutral600: '#525252',
      neutral700: '#404040',
      neutral800: '#262626',
      neutral900: '#171717',

      // Semantic
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',

      // Background & Text
      background: '#ffffff',
      text: '#171717',
      textMuted: '#737373',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fonts: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacings: {
      tight: '-0.015em',
      normal: '0',
      wide: '0.025em',
    },
    radii: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
    dark: '(prefers-color-scheme: dark)',
    motion: '(prefers-reduced-motion: no-preference)',
  },
  utils: {
    // Margin
    m: (value: string | number) => ({
      margin: value,
    }),
    mt: (value: string | number) => ({
      marginTop: value,
    }),
    mr: (value: string | number) => ({
      marginRight: value,
    }),
    mb: (value: string | number) => ({
      marginBottom: value,
    }),
    ml: (value: string | number) => ({
      marginLeft: value,
    }),
    mx: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: string | number) => ({
      marginTop: value,
      marginBottom: value,
    }),
    // Padding
    p: (value: string | number) => ({
      padding: value,
    }),
    pt: (value: string | number) => ({
      paddingTop: value,
    }),
    pr: (value: string | number) => ({
      paddingRight: value,
    }),
    pb: (value: string | number) => ({
      paddingBottom: value,
    }),
    pl: (value: string | number) => ({
      paddingLeft: value,
    }),
    px: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    // Size
    size: (value: string | number) => ({
      width: value,
      height: value,
    }),
  },
});

// Dark theme
export const darkTheme = createTheme({
  colors: {
    background: '#0a0a0a',
    text: '#fafafa',
    textMuted: '#a3a3a3',
    neutral50: '#262626',
    neutral100: '#404040',
    neutral200: '#525252',
    neutral300: '#737373',
    neutral400: '#a3a3a3',
    neutral500: '#d4d4d4',
    neutral600: '#e5e5e5',
    neutral700: '#f5f5f5',
    neutral800: '#fafafa',
    neutral900: '#ffffff',
  },
});

// Global styles
export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body: {
    fontFamily: '$sans',
    color: '$text',
    backgroundColor: '$background',
    lineHeight: '$normal',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '$semibold',
    lineHeight: '$tight',
  },
});

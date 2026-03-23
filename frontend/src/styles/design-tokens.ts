export const nn = {
  colors: {
    background: '#0e0e13',
    surface: '#0e0e13',
    surfaceDim: '#0e0e13',
    surfaceBright: '#2c2b33',
    surfaceContainerLowest: '#000000',
    surfaceContainerLow: '#131319',
    surfaceContainer: '#19191f',
    surfaceContainerHigh: '#1f1f26',
    surfaceContainerHighest: '#25252d',

    primary: '#a8a4ff',
    primaryDim: '#665bff',
    primaryContainer: '#9995ff',
    primaryBrand: '#3713ec',

    secondary: '#aa8ffd',
    secondaryDim: '#a88cfa',
    secondaryContainer: '#4e329b',

    tertiary: '#ff9dcf',
    tertiaryDim: '#eb7bb8',
    tertiaryContainer: '#fb88c6',

    onSurface: '#f9f5fd',
    onSurfaceVariant: '#acaab1',
    onPrimary: '#1f009e',
    onPrimaryFixed: '#000000',

    outline: '#76747b',
    outlineVariant: '#48474d',

    error: '#ff6e84',
    inverseSurface: '#fcf8ff',
    inverseOnSurface: '#55545b',
  },

  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    display: {
      size: '3.5rem',
      weight: 700,
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
    },
    headline: {
      size: '1.75rem',
      weight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    body: {
      size: '1rem',
      weight: 400,
      lineHeight: 1.6,
    },
    label: {
      size: '0.75rem',
      weight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },

  glass: {
    background: 'rgba(25, 25, 31, 0.6)',
    blur: '20px',
  },

  glow: {
    blur: '40px',
    opacity: 0.08,
  },
} as const

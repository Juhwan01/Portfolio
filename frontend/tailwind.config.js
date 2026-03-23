/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        nn: {
          bg: '#0e0e13',
          surface: '#0e0e13',
          'surface-low': '#131319',
          'surface-container': '#19191f',
          'surface-high': '#1f1f26',
          'surface-highest': '#25252d',
          'surface-lowest': '#000000',
          primary: '#a8a4ff',
          'primary-dim': '#665bff',
          'primary-brand': '#3713ec',
          secondary: '#aa8ffd',
          tertiary: '#ff9dcf',
          'tertiary-dim': '#eb7bb8',
          'on-surface': '#f9f5fd',
          'on-surface-variant': '#acaab1',
          outline: '#76747b',
          'outline-variant': '#48474d',
          error: '#ff6e84',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
}

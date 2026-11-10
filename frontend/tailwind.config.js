/**
 * Tailwind for the site in src/site/. The look is adapted from the Magic UI portfolio template
 * (MIT, https://github.com/magicuidesign/portfolio) — see src/site/THIRD_PARTY.md.
 * Colours are shadcn/ui neutral tokens, defined as RGB channels in src/site/site.css so opacity
 * modifiers such as `bg-card/90` work.
 * @type {import('tailwindcss').Config}
 */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/App.tsx', './src/site/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        border: token('border'),
        ring: token('ring'),
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          500: '#3B6CF6',
          600: '#2D55DB',
          700: '#2444B0',
          900: '#172554',
        },
        ink: '#0F172A',
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.18)' },
    },
  },
  plugins: [],
} satisfies Config

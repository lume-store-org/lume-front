import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7E8',
          100: '#FDEBC6',
          200: '#F9D48A',
          500: '#F5A524',
          600: '#A15C07',
          700: '#7C4700',
          900: '#3D2600',
        },
        ink: '#111827',
        nevoa: '#E5E7EB',
      },
      fontFamily: { sans: ['"Outfit Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.18)' },
    },
  },
  plugins: [],
} satisfies Config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0A0E27',
          900: '#1A1F3A',
          800: '#252D48',
        },
        neon: {
          cyan: '#00D9FF',
          purple: '#6366F1',
          pink: '#EC4899',
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      }
    },
  },
  plugins: [],
}

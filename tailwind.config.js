/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f0ff',
        'neon-purple': '#b600ff',
        'neon-pink': '#ff006e',
        'dark-bg': '#0a0e27',
        'dark-card': '#1a1f3a',
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [],
}

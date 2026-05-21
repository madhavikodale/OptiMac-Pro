/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0e27',
        'darker': '#050810',
        'card': '#0f1629',
        'card-light': '#151d3b',
        'premium': '#6366f1',
        'premium-light': '#818cf8',
        'premium-dark': '#4f46e5',
        'accent': '#00d9ff',
        'accent-purple': '#a78bfa',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 217, 255, 0.2)',
        'glow-purple': '0 0 30px rgba(167, 139, 250, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'grid-pulse': 'grid-pulse 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { opacity: 1, boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'grid-pulse': {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.2 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

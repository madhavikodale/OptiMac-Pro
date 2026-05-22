import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // COLOR PALETTE - Precision macOS System Utility
      colors: {
        // Neutral Foundation
        'neutral': {
          '950': '#0a0e27', // Deep navy (background)
          '900': '#0f1428',
          '850': '#131829',
          '800': '#1a1f35',
          '700': '#24293f',
          '600': '#2d334a',
          '500': '#3a4056',
          '400': '#4a5066',
          '300': '#5a6080',
          '200': '#7a8099',
          '100': '#a0a8c0',
          '50': '#d0d5e3',
        },
        // Electric Blue (Primary)
        'electric': {
          '900': '#0066ff',
          '800': '#0073ff',
          '700': '#1a8cff',
          '600': '#40a9ff',
          '500': '#66baff',
          '400': '#8ccbff',
          '300': '#b3deff',
          '200': '#d9f0ff',
          '100': '#ecf8ff',
        },
        // Cyan (Accent 1)
        'cyan': {
          '900': '#00d9ff',
          '800': '#00f0ff',
          '700': '#1af5ff',
          '500': '#40f9ff',
          '300': '#8cfbff',
        },
        // Purple (Accent 2)
        'purple': {
          '900': '#7c3aed',
          '800': '#8b5cf6',
          '700': '#a78bfa',
          '500': '#c4b5fd',
        },
        // Status Colors
        'success': {
          '500': '#00d084',
          '600': '#00b870',
        },
        'warning': {
          '500': '#ffa500',
          '600': '#ff9400',
        },
        'danger': {
          '500': '#ff4757',
          '600': '#ff3838',
        },
        'info': {
          '500': '#0099ff',
          '600': '#0088ee',
        },
      },

      // TYPOGRAPHY
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Menlo', 'monospace'],
        'display': ['SF Pro Display', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '-0.3px' }],
        'sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.2px' }],
        'base': ['14px', { lineHeight: '20px', letterSpacing: '-0.1px' }],
        'lg': ['15px', { lineHeight: '22px', letterSpacing: '0px' }],
        'xl': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        '2xl': ['18px', { lineHeight: '28px', letterSpacing: '0px' }],
        '3xl': ['20px', { lineHeight: '30px', letterSpacing: '0px' }],
        '4xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
        '5xl': ['32px', { lineHeight: '40px', letterSpacing: '-1px' }],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      // SPACING
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },

      // BORDER RADIUS
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // SHADOWS & GLASSMORPHISM
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
      },

      // GRADIENTS
      backgroundImage: {
        'gradient-cyan-purple': 'linear-gradient(135deg, #00d9ff 0%, #7c3aed 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #0066ff 0%, #7c3aed 100%)',
        'gradient-orange-red': 'linear-gradient(135deg, #ffa500 0%, #ff4757 100%)',
        'gradient-cyan-blue': 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
        'glass-dark': 'rgba(26, 31, 53, 0.4)',
      },

      // BACKDROP FILTER (Glassmorphism)
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      // TRANSITIONS
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ANIMATIONS
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 217, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 217, 255, 0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'shimmer': 'shimmer 8s infinite',
        'float': 'float 3s ease-in-out infinite',
      },

      // Z-INDEX
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'offcanvas': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },

      // BREAKPOINTS
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // OPACITY
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config

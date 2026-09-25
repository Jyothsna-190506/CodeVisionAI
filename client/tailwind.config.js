/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: {
          DEFAULT: '#F7F3EA',
          light: '#FFFDF8',
          dark: '#EBE5D8',
        },
        ivory: {
          DEFAULT: '#FFFDF8',
          warm: '#F2EEE5',
        },
        charcoal: {
          DEFAULT: '#242321',
          light: '#3D3B37',
          muted: '#625E57',
        },
        'primary-text': '#242321',
        'secondary-text': '#625E57',
        'muted-text': '#858078',
        'primary-card': '#FFFFFF',
        'secondary-card': '#F2EEE5',
        terracotta: {
          DEFAULT: '#D85C32',
          hover: '#B94722',
          light: '#F8E8E2',
          glow: 'rgba(216, 92, 50, 0.25)',
        },
        orange: {
          warm: '#F28A3D',
        },
        lime: {
          digital: '#799718',
          soft: '#F1F7D9',
          bright: '#B7D94B',
        },
        border: {
          pearl: 'rgba(36, 35, 33, 0.12)',
          warm: 'rgba(36, 35, 33, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pearl-sm': '0 2px 8px rgba(50, 40, 30, 0.05)',
        'pearl-md': '0 8px 24px rgba(50, 40, 30, 0.07)',
        'pearl-lg': '0 16px 40px rgba(50, 40, 30, 0.09)',
        'pearl-glass': '0 20px 50px rgba(50, 40, 30, 0.08), 0 1px 3px rgba(50, 40, 30, 0.05)',
        'terracotta-glow': '0 10px 30px -5px rgba(216, 92, 50, 0.3)',
        'lime-glow': '0 10px 30px -5px rgba(183, 217, 75, 0.3)',
      }
    },
  },
  plugins: [],
}

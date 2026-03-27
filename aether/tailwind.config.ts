/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        sidebar: '#111111',
        surface: '#161616',
        surface2: '#1c1c1c',
        hover: '#1e1e1e',
        border: 'rgba(255,255,255,0.04)',
        'border-med': 'rgba(255,255,255,0.07)',
        text: '#e8e8e8',
        muted: '#6b6b6b',
        dim: '#333333',
        accent: '#ffffff',
        green: '#4ade80',
        orange: '#fb923c',
        blue: '#60a5fa',
        purple: '#a78bfa',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
}

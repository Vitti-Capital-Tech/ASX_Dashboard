/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // lib/ was missing, so any Tailwind class written in a helper there was
    // purged from the build and the markup fell back to browser defaults.
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Dark palette
        base:    '#060912',
        surface: '#0b0f1e',
        card:    '#0e1220',
        sidebar: '#080c18',
        // Accent
        accent: {
          DEFAULT: '#6366f1',
          light:   '#a5b4fc',
          mid:     '#818cf8',
          dim:     'rgba(99,102,241,0.12)',
          glow:    'rgba(99,102,241,0.25)',
          border:  'rgba(99,102,241,0.28)',
        },
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.3s ease both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'pulse-bullish': 'pulse-bullish 2.2s ease-in-out infinite',
        'live-pulse': 'live-pulse 1.8s ease-in-out infinite',
        'spin-slow': 'spin 0.6s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(18px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.6', transform: 'scale(0.8)' },
        },
        'pulse-bullish': {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%':     { transform: 'scale(1.03)', opacity: '0.82' },
        },
        'live-pulse': {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%':     { transform: 'scale(1.3)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

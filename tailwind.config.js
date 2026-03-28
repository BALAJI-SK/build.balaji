/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Antigravity light palette
        'ag-bg':        '#F8F9FC',   // grey-10 — main background
        'ag-surface':   '#FFFFFF',   // white surface cards
        'ag-surface-2': '#EFF2F7',   // grey-20 — slightly deeper surface
        'ag-text':      '#121317',   // grey-1200 — primary text
        'ag-text-2':    '#45474D',   // grey-800 — secondary text
        'ag-muted':     '#6A6A71',   // muted/tertiary text
        'ag-outline':   'rgba(33,34,38,0.12)', // border
        'ag-outline-2': 'rgba(33,34,38,0.06)', // subtle border
        // Google brand accent colors
        'g-blue':       '#4285F4',
        'g-blue-2':     '#3279F9',   // brighter CTA blue
        'g-red':        '#EA4335',
        'g-yellow':     '#FBBC04',
        'g-green':      '#34A853',
        // Inverse surface (dark sections)
        'ag-dark':      '#121317',
        'ag-dark-2':    '#1E2029',
      },
      fontFamily: {
        display: ['"Google Sans Flex"', '"Google Sans"', 'sans-serif'],
        body:    ['"Google Sans"', 'sans-serif'],
        mono:    ['"Google Sans Mono"', 'monospace'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl':  ['8rem',   { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        '10xl': ['10rem',  { lineHeight: '0.92', letterSpacing: '-0.05em' }],
        '11xl': ['clamp(5rem,10vw,10.5rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
      },
      animation: {
        'fade-up':   'fadeUp 0.7s cubic-bezier(.19,1,.22,1) forwards',
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'orb-1':     'orbDrift1 18s ease-in-out infinite',
        'orb-2':     'orbDrift2 22s ease-in-out infinite',
        'orb-3':     'orbDrift3 16s ease-in-out infinite',
        'orb-4':     'orbDrift4 24s ease-in-out infinite',
        'float':     'float 7s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'bounce-subtle': 'bounceSub 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        orbDrift1: {
          '0%,100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':     { transform: 'translate(40px, -30px) scale(1.05)' },
          '66%':     { transform: 'translate(-20px, 20px) scale(0.97)' },
        },
        orbDrift2: {
          '0%,100%': { transform: 'translate(0px, 0px) scale(1)' },
          '40%':     { transform: 'translate(-50px, 30px) scale(1.08)' },
          '70%':     { transform: 'translate(30px, -40px) scale(0.95)' },
        },
        orbDrift3: {
          '0%,100%': { transform: 'translate(0px, 0px) scale(1)' },
          '30%':     { transform: 'translate(30px, 40px) scale(1.06)' },
          '60%':     { transform: 'translate(-40px, -20px) scale(0.98)' },
        },
        orbDrift4: {
          '0%,100%': { transform: 'translate(0px, 0px) scale(1)' },
          '45%':     { transform: 'translate(-30px, -50px) scale(1.04)' },
          '75%':     { transform: 'translate(50px, 30px) scale(0.96)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        bounceSub: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(6px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(33,34,38,0.06), 0 4px 16px rgba(33,34,38,0.06)',
        'card-md': '0 2px 8px rgba(33,34,38,0.08), 0 8px 32px rgba(33,34,38,0.08)',
        'card-lg': '0 4px 16px rgba(33,34,38,0.1), 0 16px 48px rgba(33,34,38,0.1)',
        'blue':    '0 4px 24px rgba(66,133,244,0.3)',
        'blue-lg': '0 8px 40px rgba(66,133,244,0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

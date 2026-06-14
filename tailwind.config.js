/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral grey scale (minimal). Used app-wide via the existing ink-* classes.
        ink: {
          100: '#ECEDEE',
          200: '#C9CBCF',
          300: '#A1A4AB',
          400: '#82858C',
          500: '#5B5E66',
          600: '#2b2e36',
          700: '#1f2127',
          800: '#16181d',
          900: '#0d0e11',
        },
        // Single soft accent.
        accent: {
          DEFAULT: '#5cc99a',
          dim: '#3f8f6c',
          soft: 'rgba(92,201,154,0.14)',
        },
        cinnabar: {
          400: '#ff6b5e',
          500: '#e8463a',
          600: '#c5362c',
        },
        jade: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        gold: {
          400: '#fbbf66',
          500: '#f5a623',
        },
        // Duolingo-style palette for the desktop UI.
        duo: {
          green: '#58cc02',
          greenH: '#61e002',
          greenD: '#4caf00',
          blue: '#1cb0f6',
          blueD: '#1899d6',
          gold: '#ffc800',
          goldD: '#e0a800',
          red: '#ff4b4b',
          redD: '#ea2b2b',
          purple: '#ce82ff',
          bg: '#131f24',
          card: '#1b2a32',
          card2: '#202f36',
          border: '#37464f',
          text: '#f7fcff',
          muted: '#93a1ab',
          locked: '#37464f',
          lockedD: '#26343c',
        },
      },
      fontFamily: {
        han: ['"Noto Serif SC"', '"Songti SC"', '"SimSun"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.9)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        slideup: { '0%': { transform: 'translateY(12px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
        bobble: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
      },
      animation: {
        pop: 'pop 0.25s ease-out',
        slideup: 'slideup 0.3s ease-out',
        shake: 'shake 0.35s ease-in-out',
        bobble: 'bobble 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

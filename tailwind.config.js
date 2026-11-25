/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#F7F6F2',
          paper: '#FFFFFF',
          subtle: '#F0ECE1',
          hover: '#EAE6DB',
          border: '#D8D5CE',
          'border-dark': '#B8B4AA',
          text: '#171717',
          muted: '#73716B',
          accent: '#9B382B',
          'accent-light': '#F6ECEB',
          green: '#2D5A38',
          'green-light': '#EEF4EF',
          ochre: '#8C6228',
          'ochre-light': '#F7F2E8',
          slate: '#36454F',
        },
        navy: {
          950: '#121212',
          900: '#171717',
          800: '#232323',
          700: '#333333',
          600: '#4A4A4A',
          100: '#F0ECE1',
        },
        slatebg: '#F7F6F2',
        yellowacc: '#9B382B',
        amberacc: '#8C6228',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"DM Serif Display"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '3px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
        '2xl': '8px',
      }
    },
  },
  plugins: [],
}

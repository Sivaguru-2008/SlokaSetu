/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F4EEE0',
          300: '#EADFC9',
          400: '#DCCDB0',
          500: '#CDB994'
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D1D8',
          500: '#9B1B30',
          600: '#800020',
          700: '#6B1D2F',
          800: '#551121',
          900: '#3D0A16'
        },
        gold: {
          50: '#FCFBF5',
          100: '#FAF6E6',
          200: '#F4EBCB',
          400: '#E2C264',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8C6609',
          800: '#684B06'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}

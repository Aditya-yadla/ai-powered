/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36b0fa',
          500: '#0c94eb',
          600: '#0075cb',
          700: '#005da4',
          800: '#054f87',
          900: '#0a4270',
          950: '#072a4a',
        },
        slate: {
          850: '#141e33',
          950: '#0b1120',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

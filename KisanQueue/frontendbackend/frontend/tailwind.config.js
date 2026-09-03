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
          50: '#eaf8ef',
          100: '#d1f1de',
          200: '#a7e4c0',
          300: '#72d29b',
          400: '#3ebc75',
          500: '#079447',
          600: '#08783d',
          700: '#0a6033',
          800: '#0c4d2b',
          900: '#0b3f24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

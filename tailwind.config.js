/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marsala: '#8B3A3A',
        olive: '#6B7B4C',
        cream: '#F5F0E8',
        gold: '#D4A84B',
        dustyPink: '#C9A9A6',
        pastelBlue: '#A8C4D4',
        chocolate: '#4A3728',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
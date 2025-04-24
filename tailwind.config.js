/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <-- ADD THIS
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

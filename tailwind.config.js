/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playpen': ['Playpen Sans', 'cursive']
      }
    },
  },
  plugins: [],
}
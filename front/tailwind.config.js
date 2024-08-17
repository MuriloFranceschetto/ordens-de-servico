/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        whitesmoke: '#F5F5F5',
        primary: '#3f51b5',
        accent: '#ff4081',
        warn: '#f44336',
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
      },
      fontWeight: {
        100: 100,
        300: 300,
        400: 400,
        500: 500,
        700: 700,
        900: 900,
      }
    },
  },
  plugins: [],
}
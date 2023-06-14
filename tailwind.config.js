/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    daisyui: {
      themes: ['light', 'dark'],
    },
    extend: {
      colors: {
        reservation: '#E3E3E3',
      },
      gridTemplateRows: {
        calendar: '0.3fr 1fr',
      },
      gridTemplateColumns: {
        calendar: '100px repeat(7, 1fr)',
      },
    },
  },
  plugins: [require('daisyui')],
};

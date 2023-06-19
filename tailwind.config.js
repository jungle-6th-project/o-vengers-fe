/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    daisyui: {
      themes: ['light', 'dark'],
    },
    extend: {
      colors: {
        reservation: '#E3E3E3',
        bbodog_blue: '#0725E3',
        bbodog_green: '#D2ED4A',
        bbodog_orange: '#FF784E',
      },
      gridTemplateRows: {
        calendar: '0.3fr 1fr',
      },
      gridTemplateColumns: {
        calendar: '100px repeat(21, 1fr)',
      },
    },
  },
  plugins: [require('daisyui')],
};

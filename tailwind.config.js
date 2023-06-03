/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'kakao-login': "url('../kakao-login.png')",
      },
    },
  },
  plugins: [require('daisyui')],
};

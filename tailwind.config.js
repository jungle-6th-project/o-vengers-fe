/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/ppodog.png')",
        background: "url('/chatroomBackground.svg')",
      },
      colors: {
        reservation: '#E3E3E3',
        bbodog_blue: '#0725E3',
        bbodog_green: '#D2ED4A',
        bbodog_orange: '#FF784E',
        calendar: '#F6F6F6',
        'calendar-border': '#BFBFBF',
        todo: '#434827',
      },
      width: {
        calendar: '72vw',
        ranking_todo: '18vw',
        timer: '18vw',
        group: '15vw',
      },
      minWidth: {
        'group-min': '158px',
        timer: '260px',
        leftbar: '200px',
      },
      maxWidth: {
        'group-max': '200px',
        timer: '335px',
        leftbar: '400px',
        calendar: '2564px',
        page: '2994px',
      },
      height: {
        ranking: '36vh',
        groupList: '18vh',
        calendar: '97.8vh',
        video_todo: '68.4vh',
      },
      minHeight: {
        'header-min': '144px',
      },
      maxHeight: {
        'header-max': '200px',
      },
      gridTemplateRows: {
        calendar: '0.3fr 1fr',
        container: 'max(0.2fr, 400px) 1fr',
        video_container: '0.3fr 1fr',
      },
      gridTemplateColumns: {
        calendar: '100px repeat(14, 176px)',
        container: 'auto 1fr',
        video_container: '1fr auto',
        container: 'auto 1fr',
        video_container: '0.3fr 1fr',
        rankingProfile:
          'minmax(20px, 1fr) minmax(2.75rem, 1fr) minmax(64px, 2fr)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        bbodog: {
          primary: '#0725E3',
          'primary-focus': '#1a00b7',
          'primary-content': '#ffffff',
          secondary: '#FF7842',
          'secondary-focus': '#f65633',
          'secondary-content': '#ffffff',
          accent: '#D2ED4A',
          'accent-focus': '#aede25',
          'accent-content': '#000000',
          neutral: '#000000',
          'neutral-focus': '#1f1f1f',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#ced3d9',
          'base-content': '#1e2734',
          info: '#1c92f2',
          success: '#1f2734',
          warning: '#ff9900',
          error: '#ff5724',
          '--rounded-box': '1rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '.25s',
          '--animation-input': '.2s',
          '--btn-text-case': '',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
  safelist: [
    {
      pattern:
        /(bg|text|border|btn)-(primary|primary-content|secondary|secondary-content|accent|accent-content|neutral)/,
    },
  ],
};

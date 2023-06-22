/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        reservation: '#E3E3E3',
        bbodog_blue: '#0725E3',
        bbodog_green: '#D2ED4A',
        bbodog_orange: '#FF784E',
      },
      gridTemplateRows: {
        calendar: '0.3fr 1fr',
        container: '200px 1fr',
        video_container: '200px 1fr',
      },
      gridTemplateColumns: {
        calendar: '100px repeat(21, 1fr)',
        container: '300px 1fr',
        video_container: '1fr 0.3fr',
      },
    },
  },
  daisyui: {
    themes: [{
      'bbodog': {
        'primary': '#0725E3',
        'primary-focus': '#1a00b7',
        'primary-content': '#ffffff',
        'secondary': '#FF7842',
        'secondary-focus': '#f65633',
        'secondary-content': '#ffffff',
        'accent': '#D2ED4A',
        'accent-focus': '#aede25',
        'accent-content': '#000000',
        'neutral': '#000000',
        'neutral-focus': '#1f1f1f',
        'neutral-content': '#ffffff',
        'base-100': '#ffffff',
        'base-200': '#f9fafb',
        'base-300': '#ced3d9',
        'base-content': '#1e2734',
        '--rounded-box': '1rem',
        '--rounded-btn': '.5rem',
        '--rounded-badge': '1.9rem',
        '--animation-btn': '.25s',
        '--animation-input': '.2s',
        '--btn-text-case': 'uppercase',
        '--navbar-padding': '.5rem',
        '--border-btn': '1px',
      },
    },],
  },
  plugins: [require('daisyui')],
  safelist: [
    {
      pattern:
        /(bg|text|border|btn)-(primary|primary-content|secondary|secondary-content|accent|accent-content|neutral)/,
    },
  ],
};

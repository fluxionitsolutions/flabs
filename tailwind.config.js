/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        serif: ['Poppins', 'ui-serif', 'Georgia'],
        mono: ['Poppins', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        'color1': '#FF5789', 
        'btnblue': '#5A57FF',
        'background': '#F1F1F5',
        'loginbox': '#9788F5',
        'logintxt': '#F0EDFF',
        'loginbtn':'#8371F2',
        'loginbox2': '#988AF5'
      },
      keyframes: {
        'zoom-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'zoom-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.5)', opacity: '0' },
        },
      },
      animation: {
        'zoom-in': 'zoom-in 0.6s ease-out forwards',
        'zoom-out': 'zoom-out 0.5s ease-in forwards',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          'display': 'none', /* Chrome, Safari, and Opera */
        },
      });
    },
  ],
});

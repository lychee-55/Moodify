/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f6f2ee',
        textColor: '#272b1c',
      },
      height: {
        96: '24rem', // 384px
        128: '32rem', // 512px
        // 원하는 크기 추가
      },
    },
  },
  plugins: [],
};

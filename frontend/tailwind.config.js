/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F7FB', // page background
        ink: '#12142B', // text and dark surfaces
        nova: '#3B3BF5', // primary action
        flare: '#FFB800', // highlight
        line: '#DDE0EE', // borders
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

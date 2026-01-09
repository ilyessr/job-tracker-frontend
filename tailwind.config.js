/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'ui-sans-serif', 'system-ui'],
        body: ['"Work Sans"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 20px 50px -30px rgba(15, 23, 42, 0.6)',
      },
    },
  },
  plugins: [],
};

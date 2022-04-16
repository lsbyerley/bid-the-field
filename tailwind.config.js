module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['light', 'dark'],
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
};

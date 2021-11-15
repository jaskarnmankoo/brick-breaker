module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // or false or 'class'
  theme: {
    extend: {
      colors: {
        cream: '#f3f4f5',
        'dark-mode': '#202124'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};

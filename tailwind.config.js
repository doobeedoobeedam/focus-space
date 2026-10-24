export default {
  content: ['./index.html', './src/**/*.{vue,js}'],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: { sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'] },

      colors: {
        ink: '#1b1033',
        lime: '#c8ff5a',
        pink: '#ff6fb5',
        grape: '#7c5cff',
      },
    },
  },
  plugins: [],
}

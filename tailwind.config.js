module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          text: '#2D244A',
          primary: '#764BA2',
          secondary: '#A29BFE',
          surface: '#F3F0FF',
          base: '#FDFBFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        lavender: '0 10px 30px rgba(118, 75, 162, 0.1)',
      },
      backgroundImage: {
        'gradient-lavender': 'linear-gradient(135deg, #764BA2 0%, #667EEA 100%)',
      }
    }
  },
  plugins: [],
}
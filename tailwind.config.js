module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          text: 'rgb(var(--color-lavender-text) / <alpha-value>)',
          primary: 'rgb(var(--color-lavender-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-lavender-secondary) / <alpha-value>)',
          surface: 'rgb(var(--color-lavender-surface) / <alpha-value>)',
          base: 'rgb(var(--color-lavender-base) / <alpha-value>)',
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

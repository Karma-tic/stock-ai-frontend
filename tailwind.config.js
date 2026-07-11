module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sleek Monochrome (Zinc) replacing Slate for backgrounds and neutral text
        slate: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa', // Used for secondary text
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46', // Used for borders
          800: '#27272a', // Used for cards
          900: '#18181b', // Used for section backgrounds
          950: '#09090b', // Used for main background
        },
        // Vibrant Indigo replacing Blue for accents and buttons
        blue: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8', // Used for accent text
          500: '#6366f1', // Used for highlights
          600: '#4f46e5', // Used for primary buttons
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      }
    }
  },
  plugins: [],
}
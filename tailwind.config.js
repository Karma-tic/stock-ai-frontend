// Design system: "Ink + Cobalt". Every colour is a CSS variable defined in src/index.css
// (light on :root, dark on .dark), so one class works in both themes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('bg'),
        surface: token('surface'),
        surface2: token('surface-2'),
        ink: token('text'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        cobalt: token('cobalt'), // fixed cobalt for filled buttons (white text passes AA in both themes)
        up: token('up'),
        down: token('down'),
        caution: token('caution'),
        // Legacy names used across the app pages; they now resolve to the tokens above.
        lavender: {
          text: 'rgb(var(--color-lavender-text) / <alpha-value>)',
          primary: 'rgb(var(--color-lavender-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-lavender-secondary) / <alpha-value>)',
          surface: 'rgb(var(--color-lavender-surface) / <alpha-value>)',
          base: 'rgb(var(--color-lavender-base) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', '"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        outfit: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '10px',
      },
      boxShadow: {
        lavender: '0 16px 40px -20px rgb(11 15 20 / 0.45)',
        lift: '0 16px 40px -20px rgb(11 15 20 / 0.45)',
      },
      backgroundImage: {
        // Kept for existing pages: now a solid cobalt fill, no gradient.
        'gradient-lavender': 'linear-gradient(rgb(var(--cobalt)), rgb(var(--cobalt)))',
      },
      transitionTimingFunction: {
        micro: 'cubic-bezier(.2,.8,.2,1)',
        ui: 'cubic-bezier(.16,1,.3,1)',
      },
      transitionDuration: {
        micro: '140ms',
        ui: '260ms',
      },
    },
  },
  plugins: [],
};

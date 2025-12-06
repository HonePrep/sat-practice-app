/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lucas AI inspired green palette
        'lucas': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // SAT Bluebook palette (for test interface only)
        'sat-blue': '#1e3a5f',
        'sat-light-blue': '#2c5282',
        'sat-accent': '#3182ce',
        'sat-highlight': '#ebf8ff',
        'sat-correct': '#22c55e',
        'sat-incorrect': '#ef4444',
        'sat-marked': '#f59e0b',
        'sat-crossed': '#9ca3af',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

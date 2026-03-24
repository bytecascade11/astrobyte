/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}', // Astro + JS/TS
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'background-dark': 'var(--background-dark)',
        'background-light': 'var(--background-light)',
        border: 'var(--border)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
      keyframes: {
        gradientMove: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        gradientMove: 'gradientMove 15s ease infinite',
      },
    },
  },
  plugins: [],
}

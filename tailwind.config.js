/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}', // All your source files
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
    },
  },
  plugins: [],
}

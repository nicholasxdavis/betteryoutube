/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use broad globs so Tailwind reliably discovers class names inside
  // template literals and inline HTML in this small extension project.
  content: ['./**/*.html', './**/*.js'],
  theme: {
    extend: {}
  },
  plugins: []
};


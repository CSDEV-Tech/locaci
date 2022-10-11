/** @type {import('tailwindcss').Config} */
const config = require(`../tailwind.config`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: config.theme.extend,
  },
  plugins: [],
};

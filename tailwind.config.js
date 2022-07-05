/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'lc-primary': {
          100: `#f76b0b`,
          80: `#CA5402`,
        },
        'lc-dark': `#3a3a3a`,
        'lc-darker': `#3a3335`,
        'lc-gray': `#ECEDEE`,
      },
    },
  },
  plugins: [],
};

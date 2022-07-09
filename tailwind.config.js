/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: `#f76b0b`,
          75: `#CA5402`,
          15: `#CA5402`,
        },
        secondary: {
          DEFAULT: `#2AC084`,
          75: `#209063`,
          15: `#dff6ed`,
        },
        dark: {
          DEFAULT: `#3a3335`,
        },
        gray: {
          DEFAULT: `#908E8E`,
        },
        lightgray: {
          DEFAULT: `#EFEFEF`
        },
        accent: {
          primary: {
            DEFAULT: `#FDF0D5`,
            70: "#eef3f2",
          },
          secondary: {
            DEFAULT: `#C6D8D3`,
            60: "#eef3f2",
          },
        },
      },
    },
  },
  plugins: [],
};

const config = require(`../tailwind.config`);

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', '../ui/src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            ...config.theme.extend,
            fontFamily: {
                sans: ['var(--font-poppins)']
            }
        }
    },
    plugins: []
};

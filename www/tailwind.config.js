const config = require(`../tailwind.config`);

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{ts,tsx,jsx,js}', '../ui/src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            ...config.theme.extend
        }
    },
    plugins: []
};

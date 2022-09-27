/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'translate-in': {
                    '0%': { transform: 'translate(-200%, 0)' },
                    '100%': { transform: 'translate(0%, 0)' }
                }
            },
            animation: {
                'translate-in': 'translate-in 0.3s 0.1s both'
            },
            boxShadow: {
                card: '0px 20px 24px rgba(153, 155, 168, 0.15);'
            },
            colors: {
                primary: {
                    DEFAULT: `#f76b0b`,
                    75: `#CA5402`,
                    15: `#fde8da`
                },
                danger: {
                    DEFAULT: `#EB5E55`,
                    75: `#ef867f`,
                    15: `#fbe6e5`
                },
                secondary: {
                    DEFAULT: `#2AC084`,
                    75: `#209063`,
                    15: `#dff6ed`
                },
                dark: {
                    DEFAULT: `#3a3335`,
                    75: `#6f6165`,
                },
                gray: {
                    DEFAULT: `#908E8E`
                },
                lightgray: {
                    DEFAULT: `#EFEFEF`
                },
                accent: {
                    primary: {
                        DEFAULT: `#FDF0D5`,
                        70: '#eef3f2'
                    },
                    secondary: {
                        DEFAULT: `#C6D8D3`,
                        60: '#eef3f2'
                    }
                }
            }
        }
    },
    plugins: []
};

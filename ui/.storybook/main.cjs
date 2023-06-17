module.exports = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-styling',
            options: {
                postCss: true
            }
        },
        '@storybook/addon-a11y'
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },
    core: {
        disableTelemetry: true // 👈 Disables telemetry
    },
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });
        return config;
    },
    docs: {
        autodocs: true
    }
};
//  "jest-mock": "^28.1.0"

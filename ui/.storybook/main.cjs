module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    implementation: require('postcss')
                }
            }
        },
        '@storybook/addon-a11y'
    ],
    framework: '@storybook/react',
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
    }
};
//  "jest-mock": "^28.1.0"

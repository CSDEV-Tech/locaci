const { mergeConfig } = require('vite');

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
        builder: '@storybook/builder-vite',
        disableTelemetry: true // 👈 Disables telemetry
    },
    viteFinal: async config => {
        return mergeConfig(config, {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });
    }
};
//  "jest-mock": "^28.1.0"

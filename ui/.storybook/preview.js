import '../src/styles/styles.css';
import { themes } from '@storybook/theming';

export const parameters = {
    docs: {
        theme: themes.dark
    },
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
};

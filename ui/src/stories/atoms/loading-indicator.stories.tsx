import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoadingIndicator } from '../../components/atoms/loading-indicator';

export default {
    title: 'Composants/Atoms/LoadingIndicator',
    component: LoadingIndicator
} as ComponentMeta<typeof LoadingIndicator>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof LoadingIndicator> = args => (
    <LoadingIndicator {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: 'h-10 text-white'
};

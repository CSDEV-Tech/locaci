import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Progress, ProgressProps } from '../../components/atoms/progress';

export default {
    title: 'Composants/Atoms/Progress',
    component: Progress,
    argTypes: {
        variant: {
            control: 'select'
        }
    }
} as ComponentMeta<typeof Progress>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Progress> = args => (
    <Progress {...args} />
);

export const Default = Template.bind({});
Default.args = {
    value: 50
} as ProgressProps;

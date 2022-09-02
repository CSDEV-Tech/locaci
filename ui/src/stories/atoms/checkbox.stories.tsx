import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Checkbox, CheckboxProps } from '../../components/atoms/checkbox';

export default {
    title: 'Composants/Atoms/Checkbox',
    component: Checkbox,
    argTypes: {
        variant: {
            control: 'select'
        }
    },
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof Checkbox>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Checkbox> = args => (
    <div className="h-full min-h-screen w-full bg-white p-2">
        <Checkbox {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    label: 'WIFI'
} as CheckboxProps;

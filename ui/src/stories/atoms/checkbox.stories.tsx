import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
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
} as Meta<typeof Checkbox>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof Checkbox> = args => (
    <div className="h-full min-h-screen w-full bg-white p-2">
        <Checkbox {...args} />
    </div>
);

export const Default = {
    render: Template,

    args: {
        label: 'WIFI'
    } as CheckboxProps
};

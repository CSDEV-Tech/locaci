import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Radio, RadioProps } from '../../components/atoms/radio';

export default {
    title: 'Composants/Atoms/Radio',
    component: Radio,
    argTypes: {
        variant: {
            control: 'select'
        }
    },
    parameters: {
        layout: 'fullscreen'
    }
} as Meta<typeof Radio>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof Radio> = args => (
    <div className="h-full min-h-screen w-full bg-white p-2">
        <Radio {...args} />
    </div>
);

export const Default = {
    render: Template,

    args: {
        label: 'Accepter les CGU ?'
    } as RadioProps
};

import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
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
} as ComponentMeta<typeof Radio>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Radio> = args => (
    <div className="w-full h-full bg-white min-h-screen p-2">
        <Radio {...args} />
    </div>
);

export const Default = Template.bind({});

Default.args = {
    label: 'Accepter les CGU ?'
} as RadioProps;

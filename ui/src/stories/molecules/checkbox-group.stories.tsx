import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    CheckboxGroup,
    CheckboxGroupProps
} from '../../components/molecules/checkbox-group';

export default {
    title: 'Composants/Molecules/CheckboxGroup',
    component: CheckboxGroup,
    argTypes: {
        variant: {
            control: 'select'
        }
    },
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof CheckboxGroup>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CheckboxGroup> = args => (
    <div className="w-full h-full bg-white min-h-screen p-2">
        <CheckboxGroup {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    value: ['WIFI', 'CLIM'],
    options: [
        {
            label: 'WI-FI',
            value: 'WIFI'
        },
        {
            label: 'Climatisation',
            value: 'CLIM'
        },
        {
            label: 'Radiateur',
            value: 'RADIATOR'
        },
        {
            label: 'Eau chaude',
            value: 'HOT_WATER'
        }
    ],
    label: 'Accessoires Inclus'
} as CheckboxGroupProps;

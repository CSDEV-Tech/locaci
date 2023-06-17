import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
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
} as Meta<typeof CheckboxGroup>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof CheckboxGroup> = args => (
    <div className="h-full min-h-screen w-full bg-white p-2">
        <CheckboxGroup {...args} />
    </div>
);

export const Default = {
    render: Template,

    args: {
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
    } as CheckboxGroupProps
};

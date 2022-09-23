import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    RadioGroup,
    RadioGroupProps
} from '../../components/molecules/radio-group';

export default {
    title: 'Composants/Molecules/RadioGroup',
    component: RadioGroup,
    argTypes: {
        variant: {
            control: 'select'
        }
    },
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof RadioGroup>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof RadioGroup> = args => (
    <div className="bg-white p-2">
        <RadioGroup {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    label: 'Type de logement',
    options: [
        {
            label: 'Logement long séjour',
            value: 'LOCATION'
        },
        {
            label: 'Logement court-séjour',
            value: 'SHORT_TERM'
        },
        {
            label: 'Colocation',
            value: 'SHARED_APPARTEMENT'
        }
    ]
} as RadioGroupProps;

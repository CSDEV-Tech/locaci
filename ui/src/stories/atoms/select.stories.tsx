import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Select, SelectProps } from '../../components/atoms/select';

export default {
    title: 'Composants/Atoms/Select',
    component: Select
} as ComponentMeta<typeof Select>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Select> = args => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
    className: 'w-80',
    label: 'Commune',
    value: 'ADJAMÉ',
    options: [
        {
            label: 'Adjamé',
            value: 'ADJAMÉ'
        },
        {
            label: 'Cocody',
            value: 'COCODY'
        },
        {
            label: 'Angré',
            value: 'ANGRÉ'
        }
    ]
} as SelectProps;

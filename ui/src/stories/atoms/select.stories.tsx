import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Select, SelectProps } from '../../components/atoms/select';

export default {
    title: 'Composants/Atoms/Select',
    component: Select,
    argTypes: {
        variant: {
            control: 'select'
        }
    }
} as Meta<typeof Select>;

export const Default = {
    args: {
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
    } as SelectProps
};

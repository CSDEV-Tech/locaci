import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Switch } from '../../components/atoms/switch';

export default {
    title: 'Composants/Atoms/Switch',
    component: Switch,
    argTypes: {
        variant: {
            control: `select`
        }
    }
} as Meta<typeof Switch>;

export const Default = {
    args: {
        checked: false,
        title: `Activer dark mode !`
    }
};

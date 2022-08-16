import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Switch } from '../../components/atoms/switch';

export default {
    title: 'Composants/Atoms/Switch',
    component: Switch,
    argTypes: {
        variant: {
            control: `select`
        }
    }
} as ComponentMeta<typeof Switch>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Switch> = args => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
    checked: false,
    title: `Activer dark mode !`
};

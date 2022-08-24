import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextInput } from '../../components/atoms/input';
import { At } from 'phosphor-react';

export default {
    title: 'Composants/Atoms/Input/TextInput',
    component: TextInput,
    argTypes: {
        type: {
            control: `select`
        }
    }
} as ComponentMeta<typeof TextInput>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TextInput> = args => (
    <TextInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Email',
    type: 'email',
    placeholder: `kkouakou@gmail.com`,
    className: `inline-block w-80`,
    appendix: <At stroke="2" />
};

export const Disabled = Template.bind({});
Disabled.args = {
    label: 'Email',
    placeholder: `kkouakou@gmail.com`,
    className: `inline-block w-80`,
    value: `kkouakou@gmail.com`,
    disabled: true
};

export const WithText = Template.bind({});
WithText.args = {
    label: 'Email',
    placeholder: `kkouakou@gmail.com`,
    className: `inline-block w-80`,
    value: `kkouakougmail.com`,
    errorText: "Email invalide ! Il manque un '@'",
    helpText: 'Nous vous enverrons un email pour vous connecter'
};

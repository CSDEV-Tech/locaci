import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NumberInput } from '../../components/atoms/input';
import { At, Money, User, Users } from 'phosphor-react';

export default {
    title: 'Composants/Atoms/Input/NumberInput',
    component: NumberInput
} as ComponentMeta<typeof NumberInput>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof NumberInput> = args => (
    <NumberInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Prix de location',
    placeholder: `50 000 FCFA`,
    className: `inline-block w-80`
};

export const WithAppendix = Template.bind({});
WithAppendix.args = {
    label: 'Prix de location',
    placeholder: `50 000 FCFA`,
    className: `inline-block w-80`,
    appendix: `FCFA`,
    value: 50_000
};

export const WithButtons = Template.bind({});
WithButtons.args = {
    label: 'Nombre de chambres',
    placeholder: `5`,
    className: `inline-block w-80`,
    value: 2,
    showButtons: true
};

export const WithIconAppendix = Template.bind({});
WithIconAppendix.args = {
    label: `Nombre de chambres libres`,
    placeholder: `4`,
    className: `inline-block w-80`,
    appendix: <Users weight="fill" />,
    value: 4
};

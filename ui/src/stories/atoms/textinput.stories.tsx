import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
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
} as Meta<typeof TextInput>;

export const Default = {
    args: {
        label: 'Email',
        type: 'email',
        placeholder: `kkouakou@gmail.com`,
        className: `inline-block w-80`,
        appendix: <At stroke="2" />
    }
};

export const Disabled = {
    args: {
        label: 'Email',
        placeholder: `kkouakou@gmail.com`,
        className: `inline-block w-80`,
        value: `kkouakou@gmail.com`,
        disabled: true
    }
};

export const WithText = {
    args: {
        label: 'Email',
        placeholder: `kkouakou@gmail.com`,
        className: `inline-block w-80`,
        value: `kkouakougmail.com`,
        errorText: "Email invalide ! Il manque un '@'",
        helpText: 'Nous vous enverrons un email pour vous connecter'
    }
};

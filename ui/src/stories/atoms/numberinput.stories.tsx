import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { NumberInput } from '../../components/atoms/input';
import { At, Money, User, Users } from 'phosphor-react';

export default {
    title: 'Composants/Atoms/Input/NumberInput',
    component: NumberInput
} as Meta<typeof NumberInput>;

export const Default = {
    args: {
        label: 'Prix de location',
        placeholder: `50 000 FCFA`,
        className: `inline-block w-80`
    }
};

export const WithAppendix = {
    args: {
        label: 'Prix de location',
        placeholder: `50 000 FCFA`,
        className: `inline-block w-80`,
        appendix: `FCFA`,
        value: 50_000
    }
};

export const WithButtons = {
    args: {
        label: 'Nombre de chambres',
        placeholder: `5`,
        className: `inline-block w-80`,
        value: 2,
        showButtons: true
    }
};

export const WithIconAppendix = {
    args: {
        label: `Nombre de chambres libres`,
        placeholder: `4`,
        className: `inline-block w-80`,
        appendix: <Users weight="fill" />,
        value: 4
    }
};

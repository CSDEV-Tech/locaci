import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { Button } from '../../components/atoms/button';
import { DotsThree, Smiley } from 'phosphor-react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Composants/Atoms/Button',
    component: Button,
    argTypes: {
        variant: {
            control: `select`
        },
        type: {
            control: `select`
        }
    }
} as Meta<typeof Button>;

export const Default = {
    args: {
        children: 'Button'
    }
};

export const WithLeadingIcon = {
    args: {
        children: 'Button',
        renderLeadingIcon: cls => <Smiley className={cls} />
    }
};

export const WithTrailingIcon = {
    args: {
        children: 'Button',
        renderTrailingIcon: cls => <Smiley className={`${cls} rotate-180`} />
    }
};

export const WithBothIcons = {
    args: {
        children: 'Button',
        renderLeadingIcon: cls => <Smiley className={cls} />,
        renderTrailingIcon: cls => <Smiley className={`${cls} rotate-180`} />
    }
};

export const Square = {
    args: {
        renderLeadingIcon: cls => <DotsThree className={cls} weight="bold" />,
        variant: `primary`,
        square: true
    }
};

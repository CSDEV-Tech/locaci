import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Card } from '../../components/atoms/card';

export default {
    title: 'Composants/Atoms/Card',
    component: Card
} as Meta<typeof Card>;

export const Default = {
    args: {
        children: `Card`,
        className: `font-bold p-8`
    }
};

export const Animated = {
    args: {
        children: `Animated Card`,
        animated: true,
        className: `font-bold p-8`
    }
};

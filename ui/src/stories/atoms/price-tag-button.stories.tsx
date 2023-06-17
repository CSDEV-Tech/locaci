import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    PriceTagButton,
    PriceTagButtonProps
} from '../../components/atoms/price-tag-button';

export default {
    title: 'Composants/Atoms/PriceTagButton',
    component: PriceTagButton
} as Meta<typeof PriceTagButton>;

export const Default = {
    args: {
        price: 50_000,
        selected: false
    } as PriceTagButtonProps
};

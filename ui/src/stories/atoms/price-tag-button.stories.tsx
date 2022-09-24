import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    PriceTagButton,
    PriceTagButtonProps
} from '../../components/atoms/price-tag-button';

export default {
    title: 'Composants/Atoms/PriceTagButton',
    component: PriceTagButton
} as ComponentMeta<typeof PriceTagButton>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PriceTagButton> = args => (
    <PriceTagButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
    price: 50_000
} as PriceTagButtonProps;

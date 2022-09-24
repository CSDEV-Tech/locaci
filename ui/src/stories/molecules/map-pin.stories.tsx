import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MapPin, MapPinProps } from '../../components/molecules/map-pin';
import { PriceTagButton } from '../../components/atoms/price-tag-button';

export default {
    title: 'Composants/Molecules/MapPin',
    component: MapPin
} as ComponentMeta<typeof MapPin>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof MapPin> = args => (
    <div className="flex h-80 w-80 items-center justify-center">
        <MapPin {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {} as MapPinProps;

export const WithPriceTag = Template.bind({});
WithPriceTag.args = {
    children: <PriceTagButton price={50_000} />
} as MapPinProps;

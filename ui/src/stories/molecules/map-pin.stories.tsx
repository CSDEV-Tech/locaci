import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { MapPin, MapPinProps } from '../../components/molecules/map-pin';
import { PriceTagButton } from '../../components/atoms/price-tag-button';

export default {
    title: 'Composants/Molecules/MapPin',
    component: MapPin
} as Meta<typeof MapPin>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof MapPin> = args => (
    <div className="flex h-80 w-80 items-center justify-center">
        <MapPin {...args} />
    </div>
);

export const Default = {
    render: Template,
    args: {} as MapPinProps
};

export const WithPriceTag = {
    render: Template,

    args: {
        children: <PriceTagButton price={50_000} />
    } as MapPinProps
};

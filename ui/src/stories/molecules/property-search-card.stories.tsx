import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    PropertySearchCard,
    PropertySearchCardProps
} from '../../components/molecules/property-search-card';
import { clsx } from '../../lib/functions';

export default {
    title: 'Composants/Molecules/PropertySearchCard',
    component: PropertySearchCard
} as ComponentMeta<typeof PropertySearchCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PropertySearchCard> = args => (
    <div className="w-80">
        <PropertySearchCard {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    imagesURL: [
        `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
        `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80`,
        `https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80`
    ],
    title: `Studio en colocation`,
    numberOfRooms: 2,
    surfaceArea: 9,
    address: `Riviera 6, cocody, abidjan`,
    price: 50_000,
    housingPeriod: 30,
    numberOfBedRooms: 1,
    href: '#'
} as PropertySearchCardProps;

export const Small = Template.bind({});
Small.args = {
    imagesURL: [
        `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
        `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80`,
        `https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80`
    ],
    title: `Studio en colocation`,
    numberOfRooms: 2,
    surfaceArea: 9,
    address: `Riviera 6, cocody, abidjan`,
    price: 50_000,
    housingPeriod: 30,
    numberOfBedRooms: 1,
    href: '#',
    size: 'small'
} as PropertySearchCardProps;

import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    PropertyBookingCard,
    PropertyBookingCardProps
} from '../../components/molecules/property-booking-card';

export default {
    title: 'Composants/Molecules/PropertyBookingCard',
    component: PropertyBookingCard
} as ComponentMeta<typeof PropertyBookingCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PropertyBookingCard> = args => (
    <PropertyBookingCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
    title: `Studio en colocation`,
    numberOfRooms: 2,
    surfaceArea: 9,
    address: `Riviera 6, cocody, abidjan`,
    price: 50_000,
    housingPeriod: 30,
    numberOfBedRooms: 1,
    dateOfReservation: new Date(),
    href: '#'
} as PropertyBookingCardProps;

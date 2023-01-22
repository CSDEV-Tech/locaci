import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    OwnerBookingCard,
    OwnerBookingCardProps
} from '../../components/molecules/owner-booking-card';

export default {
    title: 'Composants/Molecules/OwnerBookingCard',
    component: OwnerBookingCard
} as ComponentMeta<typeof OwnerBookingCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof OwnerBookingCard> = args => (
    <div className="absolute inset-0 grid gap-6 bg-white p-8 md:grid-cols-2">
        <OwnerBookingCard {...args} />
        <OwnerBookingCard {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
    title: `Studio en colocation`,
    dateOfReservation: new Date(),
    applicantName: 'Fred KISSIE'
} satisfies Omit<OwnerBookingCardProps, 'onShowMore'>;

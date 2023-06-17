import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    DashboardPropertyCard,
    DashboardPropertyCardProps
} from '../../components/molecules/dashboard-property-card';

export default {
    title: 'Composants/Molecules/DashboardPropertyCard/vertical',
    component: DashboardPropertyCard
} as Meta<typeof DashboardPropertyCard>;

export const Default = {
    args: {
        coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
        title: `Studio en colocation`,
        href: `#`,
        numberOfRooms: 1,
        surfaceArea: 9,
        address: `Riviera 6, cocody, abidjan`,
        isActiveForListing: true
    } as DashboardPropertyCardProps
};

export const Draft = {
    args: {
        title: `Studio meublé`,
        href: `#`,
        numberOfRooms: 1,
        surfaceArea: 9,
        isDraft: true
    } as DashboardPropertyCardProps
};

export const Disabled = {
    args: {
        title: `Studio meublé`,
        href: `#`,
        coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
        numberOfRooms: 1,
        surfaceArea: 9,
        isDraft: true,
        disabled: true
    } as DashboardPropertyCardProps
};

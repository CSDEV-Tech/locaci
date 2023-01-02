import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    HorizontalDashboardPropertyCard,
    DashboardPropertyCardProps
} from '../../components/molecules/dashboard-property-card';

export default {
    title: 'Composants/Molecules/DashboardPropertyCard/HorizontalDashboardPropertyCard',
    component: HorizontalDashboardPropertyCard
} as ComponentMeta<typeof HorizontalDashboardPropertyCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<
    typeof HorizontalDashboardPropertyCard
> = args => <HorizontalDashboardPropertyCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9,
    address: `Marché, A1, Étoile, Sagbé, Abobo, Abidjan, Côte d’Ivoire`
} as DashboardPropertyCardProps;

export const Draft = Template.bind({});
Draft.args = {
    isDraft: true,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9,
    isVisible: true,
    actions: []
} as DashboardPropertyCardProps;

export const Disabled = Template.bind({});
Disabled.args = {
    isDraft: true,
    disabled: true,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9
} as DashboardPropertyCardProps;

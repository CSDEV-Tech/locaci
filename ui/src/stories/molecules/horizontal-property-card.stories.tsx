import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    HorizontalPropertyCard,
    HorizontalPropertyCardProps
} from '../../components/molecules/horizontal-property-card';
import { Button } from '../../components/atoms/button';
import { HorizontalDotsIcon } from '../../components/atoms/icons/horizontal-dots';
import { Dropdown } from '../../components/molecules/dropdown';

export default {
    title: 'Composants/Molecules/HorizontalPropertyCard',
    component: HorizontalPropertyCard
} as ComponentMeta<typeof HorizontalPropertyCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof HorizontalPropertyCard> = args => (
    <HorizontalPropertyCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9,
    address: `Marché, A1, Étoile, Sagbé, Abobo, Abidjan, Côte d’Ivoire`
} as HorizontalPropertyCardProps;

export const Draft = Template.bind({});
Draft.args = {
    isDraft: true,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9
} as HorizontalPropertyCardProps;

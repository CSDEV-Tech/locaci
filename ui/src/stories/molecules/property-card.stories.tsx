import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    PropertyCard,
    PropertyCardProps
} from '../../components/molecules/property-card';
import { Button } from '../../components/atoms/button';
import { TrashIcon } from '../../components/atoms/icons/trash';

export default {
    title: 'Composants/Molecules/PropertyCard',
    component: PropertyCard
} as ComponentMeta<typeof PropertyCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PropertyCard> = args => (
    <PropertyCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80`,
    title: `Studio en colocation`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9,
    address: `Riviera 6, cocody, abidjan`,
    actionBar: (
        <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
                <Button variant="dark">Modifier</Button>
                <Button>Dupliquer</Button>
            </div>
            <Button
                square
                variant="danger"
                aria-label="Archiver"
                renderLeadingIcon={cls => (
                    <TrashIcon className={cls} />
                )}></Button>
        </div>
    )
} as PropertyCardProps;

export const Draft = Template.bind({});
Draft.args = {
    title: `Studio meublé`,
    href: `#`,
    numberOfRooms: 1,
    surfaceArea: 9,
    isDraft: true,
    actionBar: (
        <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
                <Button variant="dark">Modifier</Button>
            </div>
            <Button
                square
                variant="danger"
                aria-label="Supprimer"
                renderLeadingIcon={cls => (
                    <TrashIcon className={cls} />
                )}></Button>
        </div>
    )
} as PropertyCardProps;

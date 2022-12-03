import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    PresentationListingCard,
    PresentationListingCardProps
} from '../../components/molecules/presentation-listing-card';
import { Button } from '../../components/atoms/button';
import { TrashIcon } from '../../components/atoms/icons/trash';

export default {
    title: 'Composants/Molecules/PresentationListingCard',
    component: PresentationListingCard
} as ComponentMeta<typeof PresentationListingCard>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PresentationListingCard> = args => (
    <PresentationListingCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
    coverURL: `https://pub-60aa47e513094a29a0dd9ff300c7ff35.r2.dev/g5nVVq1UhZtEsZwqAZTjcZ.jpeg`,
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
} as PresentationListingCardProps;

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
} as PresentationListingCardProps;

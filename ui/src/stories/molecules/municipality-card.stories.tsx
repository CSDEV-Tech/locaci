import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    MunicipalityCard,
    MunicipalityCardProps
} from '../../components/molecules/municipality-card';

export default {
    title: 'Composants/Molecules/MunicipalityCard',
    component: MunicipalityCard
} as Meta<typeof MunicipalityCard>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof MunicipalityCard> = args => (
    <div className="px-14">
        <MunicipalityCard {...args} />
    </div>
);

export const Default = {
    render: Template,

    args: {
        name: 'Abobo',
        coverURL:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Welcome_to_ABOBO.jpg/1920px-Welcome_to_ABOBO.jpg',
        noOfListings: 145,
        href: '#'
    } as MunicipalityCardProps
};

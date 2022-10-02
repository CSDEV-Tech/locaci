import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    Breadcrumb,
    BreadcrumbProps
} from '../../components/molecules/breadcrumb';

export default {
    title: 'Composants/Molecules/Breadcrumb',
    component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Breadcrumb> = args => (
    <div className="bg-lightgray p-4">
        <Breadcrumb {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    items: [
        {
            href: '#',
            label: 'Tableau de bord'
        },
        {
            href: '#',
            label: 'Liste annonces'
        },
        {
            href: '#',
            label: 'Détails annonce'
        }
    ]
} as BreadcrumbProps;

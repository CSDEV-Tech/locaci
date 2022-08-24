import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Footer, FooterProps } from '../../components/molecules/footer';

export default {
    title: 'Composants/Molecules/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof Footer>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Footer> = args => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
    links: [
        {
            title: 'A propos',
            links: [
                {
                    href: '#',
                    label: 'Qui sommes-nous ?'
                },
                {
                    href: '#',
                    label: 'Comment ça marche ?'
                }
            ]
        },
        {
            title: 'Logement',
            links: [
                {
                    href: '#',
                    label: 'Rechercher un appartement'
                },
                {
                    href: '#',
                    label: 'Demander à devenir propriétaire'
                }
            ]
        },
        {
            title: 'Devenir propriétaire',
            links: [
                {
                    href: '#',
                    label: 'Conditions nécessaire'
                },
                {
                    href: '#',
                    label: 'Demander à devenir propriétaire'
                }
            ]
        },
        {
            title: 'Support',
            links: [
                {
                    href: '#',
                    label: 'Foire aux questions'
                },
                {
                    href: '#',
                    label: 'Communauté'
                }
            ]
        }
    ]
} as FooterProps;

import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Footer, FooterProps } from '../../components/molecules/footer';

export default {
    title: 'Composants/Molecules/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen'
    }
} as Meta<typeof Footer>;

export const Default = {
    args: {
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
    } as FooterProps
};

export const NoLinks = {
    args: {}
};

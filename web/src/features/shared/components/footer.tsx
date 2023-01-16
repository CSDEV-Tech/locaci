import * as React from 'react';
// components
import { Footer as UIFooter } from '@locaci/ui/components/molecules/footer';
import { NextLink } from './next-link';

export function Footer() {
    return (
        <>
            <UIFooter
                customLink={NextLink}
                links={[
                    {
                        title: 'A propos',
                        links: [
                            {
                                href: '/about-us',
                                label: 'Qui sommes-nous ?'
                            },
                            {
                                href: '#', // the definitive URL will be => /contact
                                label: 'Contactez-nous'
                            }
                        ]
                    },
                    {
                        title: 'Logement',
                        links: [
                            {
                                href: '/search',
                                label: 'Rechercher un appartement'
                            }
                        ]
                    },
                    {
                        title: 'Devenir propriétaire',
                        links: [
                            {
                                href: '#', // the definitive URL will be => /faq#owner-prerequisities
                                label: 'Conditions nécessaires'
                            },
                            {
                                href: '/auth/request-owner',
                                label: 'Demander à devenir propriétaire'
                            }
                        ]
                    },
                    {
                        title: 'Support',
                        links: [
                            {
                                href: '#', // the URL will be => /faq
                                label: 'Foire aux questions'
                            },
                            {
                                href: '#',
                                label: 'Communauté'
                            }
                        ]
                    }
                ]}
            />
        </>
    );
}

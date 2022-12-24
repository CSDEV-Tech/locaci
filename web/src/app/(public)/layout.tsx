// components
import { Header } from '@locaci/ui/components/organisms/header';
import { Footer } from '@locaci/ui/components/molecules/footer';
import { NextLink } from '~/features/shared/components/next-link';
import { LoginButton } from '~/features/public/components/login-button';
import { HeaderSearchButton } from '~/features/public/components/header-search-button';

// utils
import { getAllMunicipalities } from '~/server/utils';
import { use } from 'react';

// types
import type { LayoutProps } from '~/types';

export default function PublicLayout({ children }: LayoutProps) {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );
    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={
                    <HeaderSearchButton
                        defaultMunicipalities={use(municipalitiesPromise)}
                    />
                }
                trailingElement={<LoginButton />}
            />
            <main>{children}</main>
            <Footer
                className="stiky bottom-0"
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

// components
import { Header } from '@locaci/ui/components/organisms/header';
import { Footer } from '@locaci/ui/components/molecules/footer';
import { SearchButton } from '@locaci/ui/components/atoms/search-button';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { Avatar } from '@locaci/ui/components/atoms/avatar';

// utils
import { cookies } from 'next/headers';
import { Suspense, use } from 'react';
import { getUserCached } from '~/utils/ssr-helpers';

// types
import type { LayoutProps } from '~/types';

export default function MarketingLayout({ children }: LayoutProps) {
    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={
                    <SearchButton
                        className="lg:hidden"
                        href="/search"
                        customLink={NextLink}>
                        Rechercher un logement
                    </SearchButton>
                }
                trailingElement={
                    <Suspense fallback={<>loading...</>}>
                        <UserDropdown />
                    </Suspense>
                }
            />
            <main>{children}</main>
            <Footer
                className="stiky bottom-0"
                customLink={NextLink}
                // TODO : Links
                links={[]}
            />
        </>
    );
}

function UserDropdown() {
    const session = cookies().get(`__session`);
    const user = session?.value ? use(getUserCached(session.value)) : null;

    let href = '/profile';
    switch (user?.role) {
        case 'ADMIN':
            href = `/admin`;
            break;
        case 'PROPERTY_OWNER':
            href = `/owner`;
            break;
        default:
            break;
    }

    return user ? (
        <NextLink href={href} className="gap-4">
            <Avatar
                name={`${user.firstName} ${user.lastName}`}
                // TODO : Use user's image
                src="https://i.pravatar.cc/300"
            />
        </NextLink>
    ) : (
        <>
            <NextLinkButton href="/login" variant="hollow">
                Connexion
            </NextLinkButton>
        </>
    );
}

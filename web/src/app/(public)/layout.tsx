// components
import { Header } from '@locaci/ui/components/organisms/header';
import { Footer } from '@locaci/ui/components/molecules/footer';
import { SearchButton } from '@locaci/ui/components/atoms/search-button';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';

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
                    <NextLinkButton href="/auth/login" variant="hollow">
                        Connexion
                    </NextLinkButton>
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

// components
import { Header } from '@locaci/ui/components/organisms/header';
import { Footer } from '@locaci/ui/components/molecules/footer';
import { SearchButton } from '@locaci/ui/components/atoms/search-button';
import { NextLink } from '~/features/shared/components/next-link';
import { LoginButton } from '~/features/public/components/login-button';

// types
import type { LayoutProps } from '~/types';

export default function PublicLayout({ children }: LayoutProps) {
    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                trailingElement={<LoginButton />}
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

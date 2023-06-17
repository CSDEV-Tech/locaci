// components
import { Header } from '~/features/shared/components/header';
import { Footer } from '~/features/shared/components/footer';
import { NextLinkButton } from '~/features/shared/components/next-link';

// types
import type { LayoutProps } from '~/next-app-types';

export default function PublicLayout({ children }: LayoutProps) {
    return (
        <>
            <Header
                trailingElement={
                    <>
                        <NextLinkButton variant="hollow" href="/auth/login">
                            Connexion
                        </NextLinkButton>
                    </>
                }
            />
            <main>{children}</main>
            <Footer />
        </>
    );
}

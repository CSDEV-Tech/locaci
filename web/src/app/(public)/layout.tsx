// components
import { Header } from '~/features/shared/components/header';
import { LoginButton } from '~/features/public/components/login-button';
import { Footer } from '~/features/shared/components/footer';

// types
import type { LayoutProps } from '~/types';

export default function PublicLayout({ children }: LayoutProps) {
    return (
        <>
            <Header trailingElement={<LoginButton />} />
            <main>{children}</main>
            <Footer />
        </>
    );
}

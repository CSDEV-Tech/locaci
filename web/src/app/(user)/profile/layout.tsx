import React from 'react';

// components
import { Header } from '~/features/shared/components/header';
import { Footer } from '~/features/shared/components/footer';
import { LogoutButton } from '~/features/profile/components/logout-button';

// utils
import { getUserOrRedirect } from '~/server/trpc/rsc/cached-queries';
import { use } from 'react';

// types
import type { LayoutProps } from '~/next-app-types';

export default function UserLayout({ children }: LayoutProps) {
    use(getUserOrRedirect());

    return (
        <>
            <Header trailingElement={<LogoutButton />} />
            <main>{children}</main>
            <Footer />
        </>
    );
}

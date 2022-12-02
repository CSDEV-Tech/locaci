// components
import { Header } from '@locaci/ui/components/organisms/header';
import { NextLink } from '~/features/shared/components/next-link';
import { HeaderBreadCrumb } from '~/features/owner/components/header-breadcrumb';
import { UserDropdown } from '~/features/owner/components/user-dropdown';

// utils
import { redirect } from 'next/navigation';
import { getUser } from '~/server/trpc/rsc/getUser';

// types
import type { LayoutProps } from '~/types';

export default async function OwnerLayout(props: LayoutProps) {
    const user = await getUser();

    if (user?.role !== 'PROPERTY_OWNER') {
        redirect(`/auth/login`);
    }

    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={<HeaderBreadCrumb />}
                trailingElement={
                    <UserDropdown
                        user={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            avatarURL: user.avatarURL
                        }}
                    />
                }
            />
            <main>{props.children}</main>
        </>
    );
}

// components
import { Header } from '@locaci/ui/components/organisms/header';
import { NextLink } from '~/features/shared/components/next-link';
import { OwnerSidebar } from '~/features/owner/components/owner-sidebar';
import { AddButton } from '~/features/owner/components/add-button';
import { HeaderBreadCrumb } from '~/features/owner/components/header-breadcrumb';

// utils
import { getUser } from '~/server/ssr-helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// types
import type { LayoutProps } from '~/types';

export default async function OwnerLayout(props: LayoutProps) {
    const session = cookies().get('__session')?.value;
    const user = session ? await getUser(session) : null;

    if (user?.role !== 'PROPERTY_OWNER') {
        redirect(`/auth/login`);
    }

    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                hideLogo
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={
                    <>
                        <OwnerSidebar
                            user={{
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                avartarURL: user.avatarURL
                            }}
                        />

                        <HeaderBreadCrumb />
                    </>
                }
                trailingElement={
                    <>
                        <AddButton />
                    </>
                }
            />
            <main>{props.children}</main>
        </>
    );
}

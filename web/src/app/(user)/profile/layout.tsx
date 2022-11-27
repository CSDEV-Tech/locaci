import * as React from 'react';

// utils
import { getUserFromSessionToken } from '~/server/ssr-helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// types
import type { LayoutProps } from '~/types';

export default async function UserLayout({ children }: LayoutProps) {
    const session = cookies().get('__session')?.value;
    const user = session ? await getUserFromSessionToken(session) : null;

    if (user?.role !== 'HOUSING_APPLICANT') {
        redirect(`/auth/login`);
    }

    return <>{children}</>;
}

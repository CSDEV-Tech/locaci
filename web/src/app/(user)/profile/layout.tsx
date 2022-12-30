import React, { use } from 'react';

// utils
import { redirect } from 'next/navigation';
import { getUserCached } from '~/server/trpc/rsc/cached-queries';

// types
import type { LayoutProps } from '~/types';

export default function UserLayout({ children }: LayoutProps) {
    const user = use(getUserCached());

    if (user?.role !== 'HOUSING_APPLICANT') {
        redirect(`/auth/login`);
    }

    return <>{children}</>;
}

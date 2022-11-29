'use client';
import { NextBreadcrumb } from '~/features/shared/components/next-breadcrumb';
import { useHeaderBreadcrumbs } from '../hooks/use-header-breadcrumbs';

export function HeaderBreadCrumb() {
    const links = useHeaderBreadcrumbs();

    return <NextBreadcrumb links={links} className={`w-full`} />;
}
